import {
  PrismaClient,
  ApplicationStatus,
  EmploymentType,
  ExperienceLevel,
  FollowUpStatus,
  InterviewType,
  JobSource,
  JobStatus,
  ResumeType,
  Currency,
  SalaryPeriod,
  CollectorStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production-ready database...');

  // 1. Create User with extended profile fields
  const user = await prisma.user.upsert({
    where: { email: 'alex.developer@example.com' },
    update: {
      headline: 'Senior Full Stack & Solana Core Engineer',
      bio: 'Building high-throughput decentralized applications, smart contracts, and microservices.',
      github: 'https://github.com/alexrivera',
      linkedin: 'https://linkedin.com/in/alexrivera-dev',
      portfolio: 'https://alexrivera.dev',
    },
    create: {
      name: 'Alex Rivera',
      email: 'alex.developer@example.com',
      headline: 'Senior Full Stack & Solana Core Engineer',
      bio: 'Building high-throughput decentralized applications, smart contracts, and microservices.',
      github: 'https://github.com/alexrivera',
      linkedin: 'https://linkedin.com/in/alexrivera-dev',
      portfolio: 'https://alexrivera.dev',
    },
  });

  // 2. Create Skills
  const skillNames = [
    'TypeScript',
    'Rust',
    'React',
    'Solana',
    'Next.js',
    'Docker',
    'Node.js',
    'PostgreSQL',
  ];

  const skillsMap: Record<string, string> = {};
  for (const name of skillNames) {
    const skill = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name, category: 'Engineering' },
    });
    skillsMap[name] = skill.id;
  }

  // 3. User Skills
  const userSkillLevels = [
    { skill: 'TypeScript', level: 'Expert' },
    { skill: 'React', level: 'Expert' },
    { skill: 'Next.js', level: 'Advanced' },
    { skill: 'Rust', level: 'Intermediate' },
    { skill: 'Solana', level: 'Intermediate' },
    { skill: 'Docker', level: 'Intermediate' },
  ];

  for (const item of userSkillLevels) {
    await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId: skillsMap[item.skill],
        },
      },
      update: { level: item.level },
      create: {
        userId: user.id,
        skillId: skillsMap[item.skill],
        level: item.level,
      },
    });
  }

  // 4. Resumes (with Master JSON & Multi-format URLs)
  const blockchainResume = await prisma.resume.create({
    data: {
      userId: user.id,
      type: ResumeType.BLOCKCHAIN,
      version: 1,
      title: 'Blockchain Resume',
      json: {
        profile: { name: 'Alex Rivera', role: 'Blockchain Developer' },
        skills: ['Rust', 'Solana', 'Anchor', 'TypeScript'],
        experience: [
          {
            company: 'Solana Ecosystem',
            role: 'Smart Contract Engineer',
            period: '2023 - Present',
          },
        ],
      },
      pdfUrl: 'https://storage.careercopilot.com/resumes/alex_blockchain_v1.pdf',
      docxUrl: 'https://storage.careercopilot.com/resumes/alex_blockchain_v1.docx',
    },
  });

  // 5. Company with Slug & Verification
  const company = await prisma.company.upsert({
    where: { slug: 'solana-labs' },
    update: {},
    create: {
      name: 'Solana Labs',
      slug: 'solana-labs',
      website: 'https://solanalabs.com',
      careersUrl: 'https://solanalabs.com/careers',
      linkedinUrl: 'https://linkedin.com/company/solana-labs',
      githubUrl: 'https://github.com/solana-labs',
      industry: 'Web3 & Blockchain Infrastructure',
      size: '200-500',
      location: 'San Francisco, CA (Remote)',
      logo: 'https://solanalabs.com/logo.png',
      verified: true,
    },
  });

  // 6. Recruiter
  await prisma.recruiter.create({
    data: {
      name: 'Sarah Jenkins',
      companyId: company.id,
      email: 'sarah.jenkins@solanalabs.com',
      linkedin: 'https://linkedin.com/in/sarahjenkins-recruiter',
      role: 'Senior Technical Recruiter',
    },
  });

  // 7. Job Posting (Deduplication Hash + Numeric Salaries + HTML/Text descriptions + Enums)
  const jobHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const job = await prisma.job.upsert({
    where: { hash: jobHash },
    update: {},
    create: {
      hash: jobHash,
      companyId: company.id,
      title: 'Senior Solana Core Engineer',
      description:
        'We are seeking a Senior Rust & Web3 Engineer to build high-throughput Solana dApps and smart contracts.',
      descriptionHtml:
        '<h1>Senior Solana Core Engineer</h1><p>We are seeking a <strong>Senior Rust & Web3 Engineer</strong>...</p>',
      descriptionText:
        'Senior Solana Core Engineer. We are seeking a Senior Rust & Web3 Engineer to build high-throughput Solana dApps...',
      salaryMin: 180000,
      salaryMax: 220000,
      currency: Currency.USD,
      salaryPeriod: SalaryPeriod.YEARLY,
      location: 'Remote (US/EU)',
      remote: true,
      employmentType: EmploymentType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR,
      postedAt: new Date(),
      jobUrl: 'https://solanalabs.com/careers/senior-rust-engineer',
      source: JobSource.GREENHOUSE,
      status: JobStatus.ACTIVE,
      skills: {
        create: [
          { skillId: skillsMap['Rust'] },
          { skillId: skillsMap['Solana'] },
          { skillId: skillsMap['TypeScript'] },
          { skillId: skillsMap['Docker'] },
        ],
      },
    },
  });

  // 8. Match Score (JSON Strengths & Missing Skills)
  await prisma.match.upsert({
    where: {
      jobId_resumeId: {
        jobId: job.id,
        resumeId: blockchainResume.id,
      },
    },
    update: {},
    create: {
      jobId: job.id,
      resumeId: blockchainResume.id,
      score: 94.5,
      strengths: [
        'Strong alignment in Rust & Solana smart contract architecture',
        'Proven TypeScript & Web3 integration background',
      ],
      missingSkills: ['Kubernetes Cluster Ops'],
      summary:
        'Alex is a top 5% match for this position with extensive experience in Solana program development.',
    },
  });

  // 9. Cover Letter
  await prisma.coverLetter.create({
    data: {
      jobId: job.id,
      resumeId: blockchainResume.id,
      content:
        'Dear Hiring Team at Solana Labs,\n\nI am thrilled to submit my application for the Senior Solana Core Engineer position...',
    },
  });

  // 10. Application (ATS metadata & ApplicationStatus enum)
  const application = await prisma.application.create({
    data: {
      jobId: job.id,
      resumeId: blockchainResume.id,
      status: ApplicationStatus.INTERVIEW,
      appliedAt: new Date(),
      notes: 'Applied via Greenhouse integration. Referral from Sarah Jenkins.',
      externalApplicationId: 'gh_app_991823',
      appliedVia: 'Greenhouse ATS',
      lastSyncedAt: new Date(),
    },
  });

  // 11. FollowUp (FollowUpStatus enum)
  await prisma.followUp.create({
    data: {
      applicationId: application.id,
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: FollowUpStatus.PENDING,
    },
  });

  // 12. Interview (InterviewType enum)
  await prisma.interview.create({
    data: {
      applicationId: application.id,
      type: InterviewType.TECHNICAL,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      round: 1,
      notes: 'Technical round covering Solana Program Architecture, Anchor Framework, and memory optimization.',
    },
  });

  // 13. Note
  await prisma.note.create({
    data: {
      applicationId: application.id,
      content: 'Reviewed Anchor framework documentation and pre-built code samples for the round 1 interview.',
    },
  });

  // 14. Job Collector Telemetry (CollectorRun)
  await prisma.collectorRun.create({
    data: {
      source: JobSource.GREENHOUSE,
      status: CollectorStatus.COMPLETED,
      startedAt: new Date(Date.now() - 3600000),
      finishedAt: new Date(),
      jobsFound: 180,
      jobsInserted: 24,
      jobsUpdated: 156,
      errors: [],
    },
  });

  // 15. AI Generation Monitoring (AiGeneration)
  await prisma.aiGeneration.create({
    data: {
      userId: user.id,
      promptVersion: 'v2.1.0-match',
      model: 'gpt-4o',
      promptTokens: 1250,
      completionTokens: 380,
      totalTokens: 1630,
      latency: 1420,
      cost: 0.0163,
      prompt: 'Evaluate candidate Alex Rivera resume against Senior Solana Core Engineer...',
      output: 'Match Score: 94.5...',
    },
  });

  // 16. Semantic Vector Embeddings (JobEmbedding & ResumeEmbedding)
  const mockVector = Array.from({ length: 1536 }, () => Number((Math.random() * 2 - 1).toFixed(6)));

  await prisma.jobEmbedding.upsert({
    where: { jobId: job.id },
    update: {},
    create: {
      jobId: job.id,
      model: 'text-embedding-3-small',
      vector: mockVector,
      dimensions: 1536,
    },
  });

  await prisma.resumeEmbedding.upsert({
    where: { resumeId: blockchainResume.id },
    update: {},
    create: {
      resumeId: blockchainResume.id,
      model: 'text-embedding-3-small',
      vector: mockVector,
      dimensions: 1536,
    },
  });

  console.log('✅ Seeding completed successfully with all 15 schema upgrades & Vector Embeddings!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
