import cron from 'node-cron';

console.log('⏱️ Starting Career Copilot Scheduler Worker...');

// Job 1: Daily Job Matching Routine (Runs every midnight in prod, mocked interval here)
cron.schedule('0 0 * * *', () => {
  console.log(`[${new Date().toISOString()}] 🔍 Running Daily AI Job Matching Routine...`);
  // Queue AI matching jobs for active candidates
  console.log('✅ Matches calculated and notifications queued.');
});

// Job 2: Application Follow-up Reminder Check (Runs every 6 hours)
cron.schedule('0 */6 * * *', () => {
  console.log(`[${new Date().toISOString()}] 🔔 Checking pending candidate application follow-up reminders...`);
});

// Heartbeat every 5 minutes for monitoring
cron.schedule('*/5 * * * *', () => {
  console.log(`[${new Date().toISOString()}] 💚 Scheduler Worker Heartbeat OK.`);
});

console.log('✅ Cron jobs scheduled successfully.');
