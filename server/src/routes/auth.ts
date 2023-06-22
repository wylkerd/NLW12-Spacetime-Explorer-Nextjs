import { FastifyInstance } from "fastify";
import axios from "axios";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    // Chamada Http para API do Github com AXIOS
    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        // adicionara na url, exemplo: ?params1=teste,
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        },
        headers: {
          // Dizendo formato de resposta esperado
          Accept: 'application/json'
        }
      }
    )

    // Pegando access token que habilitara utilizar e manipular dados do usuario no Github
    const { access_token } = accessTokenResponse.data

    // Obtendo dados do usuario no Github
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data) // validando dados recebidos

    let user = await prisma.user.findUnique({
      where: {
        gitHubId: userInfo.id, // gitHubId precisa ser @unique noschema para utilizar este metodo
      }
    })

    // Criando um novo usuario caso nao exista
    if (!user) {
      user = await prisma.user.create({
        data: {
          gitHubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url
        },
      })
    }

    // 1ª Payload obj - Informacoes publicas do usuario que estarão contidas no JWT Token (DTO seguro para front-end usar)
    // 2ª Payload obj - Subject: A qual usuario pertence este Token JWT (Contem uma informacao unica do usuario) + Tempo de Expiração
    const token = app.jwt.sign(
      {
        name: userInfo.name,
        avatarUrl: userInfo.avatar_url,
      }, 
      {
        sub: user.id,
        expiresIn: '30 days'
      })

    /* O TOKEN JWT é utilizado para o front-end realizar as requisicoes futuras enquando for válido, 
    e para o backend identificar qual usuario está fazendo esta requisição com o id contido no sub */
    return {
      token,
    }
  })
}