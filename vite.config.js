import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves project sites from /<repository-name>/ while Vercel
// serves this same application from the domain root.
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/Kashif-Constructions-Management-System/' : '/',
  build: { outDir: 'dist', sourcemap: false },
});
