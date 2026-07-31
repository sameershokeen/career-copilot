import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mock In-Memory Job Database
const MOCK_JOBS = [
  {
    id: 'job-101',
    title: 'Senior Full Stack Engineer',
    company: 'TechFlow Systems',
    location: 'San Francisco, CA',
    workplaceType: 'Hybrid',
    salaryRange: '$150,000 - $185,000',
    description: 'Looking for a Senior Full Stack Engineer proficient in Next.js, TypeScript, Node.js, and Cloud Infrastructure.',
    requirements: ['5+ years full stack experience', 'React/Next.js & TypeScript', 'Node.js / Express microservices', 'AWS or GCP deployment'],
    tags: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    postedAt: '2026-07-30T10:00:00Z',
    sourceUrl: 'https://careers.techflow.io/jobs/101'
  },
  {
    id: 'job-102',
    title: 'AI / ML Solutions Architect',
    company: 'Neural Labs AI',
    location: 'Remote',
    workplaceType: 'Remote',
    salaryRange: '$170,000 - $210,000',
    description: 'Lead the architecture of generative AI products, LLM integrations, fine-tuning pipelines, and fast API microservices.',
    requirements: ['Python, FastAPI, PyTorch', 'OpenAI/Anthropic API integration', 'Vector databases (Pinecone, Qdrant)', 'System Design'],
    tags: ['Python', 'FastAPI', 'LLM', 'AI', 'Vector DB'],
    postedAt: '2026-07-29T14:30:00Z',
    sourceUrl: 'https://neurallabs.ai/careers/architect'
  },
  {
    id: 'job-103',
    title: 'Frontend React Developer',
    company: 'Vibrant Digital',
    location: 'New York, NY',
    workplaceType: 'On-Site',
    salaryRange: '$120,000 - $145,000',
    description: 'Craft beautiful, high-performance web interfaces for modern enterprise client applications.',
    requirements: ['3+ years React & Tailwind CSS', 'Framer Motion animations', 'State management (Zustand/Redux)', 'Performance optimization'],
    tags: ['React', 'Tailwind CSS', 'TypeScript', 'UI/UX'],
    postedAt: '2026-07-31T08:15:00Z',
    sourceUrl: 'https://vibrantdigital.com/jobs/react-dev'
  },
  {
    id: 'job-104',
    title: 'Backend Systems Engineer',
    company: 'DataStream Core',
    location: 'Austin, TX',
    workplaceType: 'Remote',
    salaryRange: '$140,000 - $175,000',
    description: 'Build high-throughput data processing pipelines, database ORM integrations, and microservices.',
    requirements: ['Node.js / Go', 'PostgreSQL / Redis / Kafka', 'REST & GraphQL APIs', 'Docker / Kubernetes'],
    tags: ['Node.js', 'Go', 'PostgreSQL', 'Docker'],
    postedAt: '2026-07-28T09:00:00Z',
    sourceUrl: 'https://datastream.io/careers/backend'
  }
];

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ service: 'Job Engine Service', status: 'healthy', timestamp: new Date().toISOString() });
});

// GET /api/v1/jobs - Search and Filter Jobs
app.get('/api/v1/jobs', (req: Request, res: Response) => {
  const { query, location, workplaceType } = req.query;

  let filtered = [...MOCK_JOBS];

  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(q) || 
      job.company.toLowerCase().includes(q) ||
      job.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  if (location && typeof location === 'string') {
    const loc = location.toLowerCase();
    filtered = filtered.filter(job => job.location.toLowerCase().includes(loc));
  }

  if (workplaceType && typeof workplaceType === 'string') {
    filtered = filtered.filter(job => job.workplaceType.toLowerCase() === (workplaceType as string).toLowerCase());
  }

  res.json({
    total: filtered.length,
    jobs: filtered
  });
});

// GET /api/v1/jobs/:id - Single Job Detail
app.get('/api/v1/jobs/:id', (req: Request, res: Response) => {
  const job = MOCK_JOBS.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job listing not found' });
  }
  res.json(job);
});

// POST /api/v1/jobs - Ingest New Job Listing
app.post('/api/v1/jobs', (req: Request, res: Response) => {
  const { title, company, location, workplaceType, salaryRange, description, requirements, tags, sourceUrl } = req.body;

  if (!title || !company || !description) {
    return res.status(400).json({ error: 'Title, company, and description are required' });
  }

  const newJob = {
    id: `job-${Date.now()}`,
    title,
    company,
    location: location || 'Remote',
    workplaceType: workplaceType || 'Remote',
    salaryRange: salaryRange || 'Competitive',
    description,
    requirements: requirements || [],
    tags: tags || [],
    postedAt: new Date().toISOString(),
    sourceUrl
  };

  MOCK_JOBS.unshift(newJob);
  res.status(201).json(newJob);
});

app.listen(PORT, () => {
  console.log(`🚀 Job Engine Microservice running on http://localhost:${PORT}`);
});
