import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';

function watchExcelProjectsPlugin() {
  return {
    name: 'watch-excel-projects',
    buildStart() {
      try {
        console.log('[excel-projects] Parsing Academic Projects.xlsx...');
        execSync('node scripts/build-projects-data.mjs', { stdio: 'inherit' });
      } catch (err) {
        console.error('[excel-projects] Error building projects data:', err);
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('Academic Projects.xlsx')) {
        console.log('[excel-projects] Academic Projects.xlsx changed! Rebuilding dataset...');
        try {
          execSync('node scripts/build-projects-data.mjs', { stdio: 'inherit' });
          server.ws.send({ type: 'full-reload' });
        } catch (err) {
          console.error('[excel-projects] Error rebuilding projects data:', err);
        }
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [watchExcelProjectsPlugin(), react(), tailwindcss()],
});
