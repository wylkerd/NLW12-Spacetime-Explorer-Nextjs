import { randomUUID } from "node:crypto"; // crypto: módulo interno do Node, não precisa instalar
import { extname, resolve } from "node:path";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline) // Promise da pipeline que indica a finalizacao da stream 

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      // Padrao para o arquivo a ser recebido
      limits: {
        fileSize: 5_242_888, // 5242888 = 5mb em bytes
      }
    })

    // se nao houver arquivo
    if (!upload) {
      return reply.status(400).send()
    }

    // Regex para verificar string de Video ou Imagem por mimetype
    const mimetypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimetypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    console.log(upload.filename)

    // Id unico para o file, para eviter arquivos duplicados
    const fileId = randomUUID()

    // retorna a extensao do arquivo
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    // Escrevendo arquivo no disco aos poucos com Streaming do Node
    const writeStream = createWriteStream(
      // resolve() padroniza o caminho do arquivo indeppendentemente do Sistema Operacional e indica local para salvar o arquivo
      // __dirname: variavel global do Node que retorna o diretorio atual
      resolve(__dirname, '../../uploads/', fileName)
    )

    // PRODUÇÃO: Amazon S3, Google Cloud Storage, Cloudflare R2, ...

    await pump(upload.file, writeStream) // Aguarda finalizar o processo

    // Cirando URL para o arquivo
    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}