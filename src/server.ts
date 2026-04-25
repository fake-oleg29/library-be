import app from './app';
import config from './config';
import prisma from './config/prisma';

async function bootstrap() {
  try {
    await prisma.$connect();
    
    const server = app.listen(config.port, () => {
      console.log(`Server started on port ${config.port} (${config.nodeEnv})`);
    });

    const closeSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    
    closeSignals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`Shutting down (${signal})...`);
        await prisma.$disconnect();
        server.close(() => process.exit(0));
      });
    });

  } catch (err) {
    console.error('Fatal startup error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

bootstrap();