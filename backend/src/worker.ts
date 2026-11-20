import { config } from './config';
import { prisma } from './lib/prisma';
import { matchingService } from './modules/matching/matching.service';

console.log('🤖 RealEstate Background Worker started...');
console.log(`Environment: ${config.env}`);

// Periodic health & background scheduler loop (runs every 60 seconds)
async function runWorkerLoop() {
  try {
    // Process pending matching results or scheduled notifications
    const pendingNotifications = await prisma.notificationQueue.findMany({
      where: {
        status: 'QUEUED',
        scheduledFor: { lte: new Date() },
      },
      take: 10,
    });

    if (pendingNotifications.length > 0) {
      console.log(`[Worker] Found ${pendingNotifications.length} scheduled notifications to process.`);
    }
  } catch (error) {
    console.error('[Worker Error]:', error);
  }
}

setInterval(runWorkerLoop, 60000);
runWorkerLoop();
