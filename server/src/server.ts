import fastify from 'fastify'
import { memoriesRoutes } from "./routes/memories"

const app = fastify()

// metodo register serve para registrar um arquivo de rotas sepado
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server runing on http://localhost:3333') // emoji adicionado com windows + .
  })

// Acessar o banco de dados pelo servidor
// npm i @prisma/client
