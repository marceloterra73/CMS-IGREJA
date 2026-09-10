import http from 'http';
import { app } from './app.js';
import { config } from './config/index.js';
import { closeDatabase } from './db/index.js';

const server = http.createServer(app);

function start(): void {
  server.listen(config.port, config.host, () => {
    console.log(`====================================================`);
    console.log(` CMS VISUAL PARA IGREJAS — SERVIDOR HTTP BASE`);
    console.log(` Fase 56: Fundação do Backend e API v1`);
    console.log(` Ambiente: ${config.nodeEnv}`);
    console.log(` Endereço: http://${config.host}:${config.port}`);
    console.log(` Health:   http://${config.host}:${config.port}/api/v1/health`);
    console.log(` Status:   http://${config.host}:${config.port}/api/v1/status`);
    console.log(`====================================================`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        console.error(`Porta ${config.port} requer privilégios elevados.`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Porta ${config.port} já está em uso.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}

// Encerramento gracioso do servidor (Graceful Shutdown)
function setupGracefulShutdown(): void {
  const shutdown = (signal: string) => {
    console.log(`\nSinal ${signal} recebido. Encerrando servidor HTTP graciosamente...`);

    server.close(async (err) => {
      if (err) {
        console.error('Erro ao encerrar servidor HTTP:', err);
        await closeDatabase();
        process.exit(1);
      }
      await closeDatabase();
      console.log('Servidor HTTP e conexões de banco encerrados com sucesso.');
      process.exit(0);
    });

    // Forçar encerramento caso conexões fiquem presas por mais de 5s
    setTimeout(() => {
      console.error('Encerramento forçado após timeout de conexões ativas.');
      process.exit(1);
    }, 5000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

setupGracefulShutdown();

// Iniciar apenas se executado diretamente
if (process.env.NODE_ENV !== 'test') {
  start();
}

export { server, app };
