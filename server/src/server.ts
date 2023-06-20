import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const prisma = new PrismaClient() // Abrindo conexao

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server runing on http://localhost:3333') // emoji adicionado com windows + .
  })

app.get('/users', async () => {
  const users = await prisma.user.findMany()

  return users
})

// Acessar o banco de dados pelo servidor
// npm i @prisma/client
