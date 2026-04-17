import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://1e14c3489fcb.vps.myjino.ru:5000/api/v1';
  const apiOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/v1': {
          target: apiOrigin,
          changeOrigin: true
        },
        '/assets': {
          target: apiOrigin,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
