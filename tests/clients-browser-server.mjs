import { createServer } from 'vite'
const server = await createServer({
  cacheDir: 'node_modules/.vite-tests/browser',
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  plugins: [
    {
      name: 's05-fixtures-only',
      configureServer(vite) {
        vite.middlewares.use((request, response, next) => {
          const route = request.url?.split('?')[0]
          if (route === '/images/clientes/erro.svg') {
            response.setHeader('Content-Type', 'image/svg+xml')
            response.end('imagem de teste inválida')
            return
          }
          const match = route?.match(/^\/images\/clientes\/teste-(\d+)\.svg$/)
          if (!match) {
            next()
            return
          }
          response.setHeader('Content-Type', 'image/svg+xml')
          response.setHeader('Cache-Control', 'no-store')
          response.end(
            `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="104"><rect x="1" y="1" width="188" height="102" rx="8" fill="#101e32"/><text x="95" y="48" text-anchor="middle" font-family="Arial" font-size="22" fill="#bac7d8">TESTE ${match[1]}</text><text x="95" y="72" text-anchor="middle" font-family="Arial" font-size="10" fill="#7ffbfd">FIXTURE SEM MARCA REAL</text></svg>`,
          )
        })
      },
    },
  ],
})
await server.listen()
console.log('Harness S05: http://127.0.0.1:5174/tests/clients-harness.html')
