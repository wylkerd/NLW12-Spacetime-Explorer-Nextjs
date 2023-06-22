import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from "../lib/prisma"

export async function memoriesRoutes(app: FastifyInstance) {

  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
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
  app.get('/memories/:id', async (request) => {

    // Validação para a variavel id que será recebida com parametro
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    // Objeto com parametros da rota, sendo passado para o ZOD fazer as validacoes necessarias
    const { id } = paramsSchema.parse(request.params)

    // Encontra uma memoria ou senão, despara um erro
    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id
      }
    })

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
        userId: '37e13105-0cb9-456f-81ef-3495f0ca320e'
      }
    })

    return memory
  })

  app.put('/memories/:id', async (request) => {
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

    const memory = await prisma.memory.update({
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

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id
      }
    })
  })
}
