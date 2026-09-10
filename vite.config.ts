import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import {defineConfig, Plugin} from 'vite';

function zipDownloadPlugin(): Plugin {
  return {
    name: 'zip-download-plugin',
    configureServer(server) {
      server.middlewares.use('/api/download-project-zip', async (_req, res) => {
        try {
          const zip = new JSZip();
          const rootDir = process.cwd();

          function addDirectoryToZip(dirPath: string, zipFolder: JSZip) {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
              if (
                item === 'node_modules' ||
                item === 'dist' ||
                item === '.git' ||
                item === '.next' ||
                item === 'bun.lock' ||
                item.endsWith('.log')
              ) {
                continue;
              }
              const fullPath = path.join(dirPath, item);
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory()) {
                const subFolder = zipFolder.folder(item);
                if (subFolder) {
                  addDirectoryToZip(fullPath, subFolder);
                }
              } else {
                const fileContent = fs.readFileSync(fullPath);
                zipFolder.file(item, fileContent);
              }
            }
          }

          addDirectoryToZip(rootDir, zip);

          const zipBuffer = await zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 },
          });

          res.setHeader('Content-Type', 'application/zip');
          res.setHeader(
            'Content-Disposition',
            'attachment; filename="cms-visual-igrejas.zip"'
          );
          res.setHeader('Content-Length', zipBuffer.length.toString());
          res.end(zipBuffer);
        } catch (error) {
          console.error('Erro ao gerar arquivo ZIP:', error);
          res.statusCode = 500;
          res.end('Erro ao gerar arquivo ZIP');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), zipDownloadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
