import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from "./routes/memories"
import { authRoutes } from "./routes/auth"

const app = fastify()

app.register(cors, {
  origin: true, // todas URLs de frontend poderao acessar o back-end
  // origin: ['http://localhost:3000']
})

app.register(jwt, {
  secret: 'spacetime', // pode ser uma string qualquer ex: auiausd12j3kg12
})

// metodo register serve para registrar um arquivo de rotas sepado
app.register(memoriesRoutes)
app.register(authRoutes)

app
  .listen({
    port: 3333,
    host: 'localhost',
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333') // emoji adicionado com windows + .
  })

// Acessar o banco de dados pelo servidor
// npm i @prisma/client
