import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@/components': resolve(__dirname, './src/components'),
        '@/pages': resolve(__dirname, './src/pages'),
        '@/hooks': resolve(__dirname, './src/hooks'),
        '@/utils': resolve(__dirname, './src/utils'),
        '@/types': resolve(__dirname, './src/types'),
        '@/contexts': resolve(__dirname, './src/contexts'),
        '@/styles': resolve(__dirname, './src/styles'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: 'terser',
      target: 'es2020',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log', 'console.info'] : [],
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'animation-vendor': ['framer-motion'],
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            'ui-vendor': ['react-hot-toast'],
            'admin': ['./src/pages/AdminPage.tsx'],
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name!.split('.');
            const ext = info[info.length - 1];
            
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name!)) {
              return `images/[name]-[hash][extname]`;
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name!)) {
              return `fonts/[name]-[hash][extname]`;
            }
            
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true,
      cssCodeSplit: true,
    },
    server: {
      port: 3000,
      open: false,
      cors: true,
      hmr: {
        overlay: true,
      },
    },
    preview: {
      port: 4173,
      open: false,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'react-hot-toast',
      ],
      exclude: [
        'firebase/app',
        'firebase/auth', 
        'firebase/firestore',
        'firebase/storage'
      ],
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProduction 
          ? '[hash:base64:5]' 
          : '[name]__[local]___[hash:base64:5]',
      },
    },
  };
});