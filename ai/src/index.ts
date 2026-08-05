/**
 * Part 3 — AI Layer public surface.
 *
 * The AI layer is never exposed to the internet and never speaks to the
 * frontend. backend/ imports exclusively from this file. This keeps the
 * AI layer swappable — changing models, providers, or internal prompt
 * structure requires zero changes outside this folder.
 */

export { parseResume } from "./services/resumeParser.service.js";
export { computeMatchScore } from "./services/matchScorer.service.js";
export { generateCoverLetter } from "./services/coverLetterGenerator.service.js";
export { autoFillAndSubmit } from "./services/autoFillEngine.service.js";
export { runBulkAutoFill } from "./services/autoFillBulk.service.js";
export type { BulkAutoFillOptions, BulkAutoFillSummary } from "./services/autoFillBulk.service.js";

export type {
  ParsedResume,
  ResumeParserInput,
  MatchScore,
  MatchScorerInput,
  CoverLetterInput,
  CoverLetterOutput,
  Tone,
  AutoFillJobInput,
  AutoFillResult,
  AutoFillLogEvent,
  ApplicationStatus,
} from "./types/index.js";
