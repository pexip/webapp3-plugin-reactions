import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ command, mode, isPreview }) => {
  const isDevServer = command === 'serve' && !isPreview
  const env = loadEnv(mode, '.', '')
  const infinityTarget = env.VITE_INFINITY_TARGET
  const port = Number(env.VITE_DEV_SERVER_PORT ?? 5173)

  if (isDevServer) {
    if (!infinityTarget) {
      throw new Error(
        'VITE_INFINITY_TARGET is required. Copy .env.example to .env and set your Pexip Infinity URL.'
      )
    }
    const targetUrl = new URL(infinityTarget)
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      throw new Error('VITE_INFINITY_TARGET must be an HTTP or HTTPS URL.')
    }
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(
        'VITE_DEV_SERVER_PORT must be an integer from 1 to 65535.'
      )
    }
  }

  return {
    base: './',
    build: {
      target: 'esnext'
    },
    plugins: [
      ...(isDevServer ? [mkcert()] : []),
      {
        name: 'local-branding-manifest',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use(
            '/webapp3/branding/manifest.json',
            (_req, res) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  images: {},
                  translations: {},
                  plugins: [
                    {
                      id: 'webapp3-plugin-reactions',
                      src: `https://localhost:${port}`,
                      sandboxValues: ['allow-same-origin']
                    }
                  ]
                })
              )
            }
          )
        }
      }
    ],
    server: isDevServer
      ? {
          host: 'localhost',
          allowedHosts: ['localhost'],
          strictPort: true,
          port,
          open: '/webapp3/',
          proxy: {
            '/api': {
              target: infinityTarget,
              changeOrigin: true,
              secure: false
            },
            '/webapp3': {
              target: infinityTarget,
              changeOrigin: true,
              secure: false
            }
          }
        }
      : undefined
  }
})
