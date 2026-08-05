import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { scraperDb } from "../config/db";
import { cache, withCache, TTL } from "../services/cacheStore";
import { getJobById } from "../services/jobsEnrich";
import { asyncHandler } from "../middleware/errorHandler";
import { rateLimiters } from "../middleware/rateLimiter";

export const jobsRouter = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  region: z.enum(["india", "international"]).optional(),
  remote: z.coerce.boolean().optional(),
  postedWithin: z.enum(["24h", "3d", "7d"]).optional(),
  search: z.string().trim().min(1).optional(),
});

const INTERVAL_BY_WINDOW: Record<string, string> = {
  "24h": "1 day",
  "3d": "3 days",
  "7d": "7 days",
};

function buildFilters(q: z.infer<typeof listQuerySchema>) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (q.region) {
    params.push(q.region);
    clauses.push(`region = $${params.length}`);
  }
  if (q.remote !== undefined) {
    params.push(q.remote);
    clauses.push(`is_remote = $${params.length}`);
  }
  if (q.postedWithin) {
    clauses.push(`date_posted >= NOW() - INTERVAL '${INTERVAL_BY_WINDOW[q.postedWithin]}'`);
  }
  if (q.search) {
    params.push(`%${q.search}%`);
    clauses.push(`(title ILIKE $${params.length} OR company ILIKE $${params.length})`);
  }

  return { where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

// GET /api/jobs — paginated list, cached 15 min per filter combination
jobsRouter.get(
  "/",
  rateLimiters.jobsList,
  asyncHandler(async (req, res) => {
    const q = listQuerySchema.parse(req.query);
    const filtersHash = crypto.createHash("sha1").update(JSON.stringify(q)).digest("hex");
    const cacheKey = `jobs:list:${filtersHash}`;

    const result = await withCache(cacheKey, TTL.JOBS_LIST, async () => {
      const { where, params } = buildFilters(q);
      const offset = (q.page - 1) * q.pageSize;

      const countRes = await scraperDb.query(`SELECT COUNT(*)::int AS total FROM jobs ${where}`, params);
      const dataRes = await scraperDb.query(
        `SELECT * FROM jobs ${where} ORDER BY date_posted DESC NULLS LAST, id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, q.pageSize, offset]
      );

      return {
        jobs: dataRes.rows,
        pagination: {
          page: q.page,
          pageSize: q.pageSize,
          total: countRes.rows[0].total as number,
          totalPages: Math.ceil(countRes.rows[0].total / q.pageSize),
        },
      };
    });

    res.json(result);
  })
);

// GET /api/jobs/:id — single job detail, cached 30 min
jobsRouter.get(
  "/:id",
  rateLimiters.jobsList,
  asyncHandler(async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const job = await getJobById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ job });
  })
);

// POST /api/jobs/search — full-text search + filters (same as GET / but body-based, for complex filter UIs)
jobsRouter.post(
  "/search",
  rateLimiters.jobsList,
  asyncHandler(async (req, res) => {
    const q = listQuerySchema.parse(req.body);
    const filtersHash = crypto.createHash("sha1").update(JSON.stringify(q)).digest("hex");
    const cacheKey = `jobs:list:${filtersHash}`;

    const result = await withCache(cacheKey, TTL.JOBS_LIST, async () => {
      const { where, params } = buildFilters(q);
      const offset = (q.page - 1) * q.pageSize;
      const dataRes = await scraperDb.query(
        `SELECT * FROM jobs ${where} ORDER BY date_posted DESC NULLS LAST, id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, q.pageSize, offset]
      );
      return { jobs: dataRes.rows };
    });

    res.json(result);
  })
);
