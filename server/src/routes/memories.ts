import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from "../lib/prisma"

export async function memoriesRoutes(app: FastifyInstance) {
  // Verificação de autenticação do usuário antes de cada execução de persistencia para este arquivo
  app.addHook('preHandler', async (request) => {
    // cancela a execução caso não tenha token válido by @fastify/jwt
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {

    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...')
      }
    })
  })
  
  // pegando parametros da request com (request), recurso do proprio Fastify
  app.get('/memories/:id', async (request, reply) => {

    // Validação para a variavel id que será recebida com parametro
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    // Objeto com parametros da rota, sendo passado para o ZOD fazer as validações necessarias
    const { id } = paramsSchema.parse(request.params)

    // Encontra uma memoria ou senão, despara um erro
    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id
      }
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return memory
  })
  
  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false) // coerce: converte o valor para Boolean
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
    
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub
      }
    })

    return memory
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false) // coerce: converte o valor para Boolean
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }
    
    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      }
    })

    // retorno do dado atualizado
    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id
      }
    })
  })
}
