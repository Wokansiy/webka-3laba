import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Vite configuration for the SunnyWeather demo app.
export default defineConfig({
  plugins: [react()],
});
