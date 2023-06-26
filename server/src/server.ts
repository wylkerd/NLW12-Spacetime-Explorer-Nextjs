import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from "./routes/memories"
import { authRoutes } from "./routes/auth"
import { uploadRoutes } from "./routes/upload"

const app = fastify()

// Registro de libs usadas
app.register(multipart) // Habilita o fastify receber qualquer tipo de arquivo, como imagens

app.register(cors, {
  origin: true, // todas URLs de frontend poderao acessar o back-end
  // origin: ['http://localhost:3000']
})

app.register(jwt, {
  secret: 'spacetime', // pode ser uma string qualquer ex: auiausd12j3kg12
})

// Metodo register serve para registrar um arquivo de rotas sepado
app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333') // emoji adicionado com windows + .
  })

// Acessar o banco de dados pelo servidor
// npm i @prisma/client
