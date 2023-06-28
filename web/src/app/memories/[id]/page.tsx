'use client'

import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { Camera, ChevronLeft } from 'lucide-react'
import Cookie from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { MediaPicker } from '@/components/MediaPicker'
import { AxiosResponse } from 'axios'

/* O Nest.js permite fazer chamadas http diretamente de componentes, 
  anotando-os como assíncronos, sem necessidade de useEffect ou estados de variáveis,
  em componentes que não recebem a anotação 'use client' */

dayjs.locale(ptBR)

interface Memory {
  id: string
  coverUrl: string
  content: string
  createdAt: string
  isPublic: boolean
}

export default function MemoryDetail() {
  const [memory, setMemory] = useState<Memory | null>(null)
  const [hasPreview, setHasPreview] = useState<Boolean>(false)
  const [memoryIsPublic, setMemoryIsPublic] = useState<Boolean>(false)
  const [memoryContent, setMemoryContent] = useState<string>()

  const token = Cookie.get('token')
  const pathname = usePathname()
  const router = useRouter()
  const memoryId = pathname.split('/')[2]

  async function handleGetMemory() {
    const response: AxiosResponse<Memory> = await api.get(
      `/memories/${memoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    setMemory(response.data)
    setMemoryIsPublic(response.data.isPublic)
    setMemoryContent(response.data.content)

    if (!memory) {
      return <EmptyMemories />
    }
  }

  async function handleUpdateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // evita redirecionamento de pagina

    const formData = new FormData(event.currentTarget)

    // console.log(Array.from(formData.entries()))

    const fileToUpload = formData.get('coverUrl')
    let fileToUploadName = ''
    let coverUrl = ''

    /* verificando primeiro se a variável é de fato um arquivo */
    if (fileToUpload instanceof File) {
      fileToUploadName = fileToUpload.name
    }

    if (fileToUpload && fileToUploadName) {
      const uploadFormData = new FormData() // novo multipart/form-data para enviar ao backend
      uploadFormData.set('file', fileToUpload)

      // Upload de imagem no Backend
      const uploadResponse = await api.post('/upload', uploadFormData)

      // URL contendo endereço da imagem no backend
      coverUrl = uploadResponse.data.fileUrl
    }

    // Salvando memoria no Banco de Dados
    await api.put(
      `/memories/${memoryId}`,
      {
        coverUrl: fileToUploadName ? coverUrl : memory?.coverUrl,
        content: memoryContent,
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/')
  }

  useEffect(() => {
    handleGetMemory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-10 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      {/* Formulario de UPDATE */}
      <form
        onSubmit={handleUpdateMemory}
        className="flex flex-1 flex-col gap-2 space-y-4"
      >
        <div className="flex items-center gap-4">
          {/* Hackzinho para input type file */}
          <label
            htmlFor="media"
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <Camera className="h-4 w-4" />
            Anexar mídia
          </label>

          <label
            htmlFor="isPublic"
            className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <input
              type="checkbox"
              name="isPublic" // Form utiliza
              id="isPublic"
              onChange={() => setMemoryIsPublic(!memoryIsPublic)}
              value={'true'}
              checked={!!memoryIsPublic}
              // Estilização do checkbox com a lib @tailwindcss/forms
              className="h-4 w-4 rounded border-gray-700 bg-gray-700 text-purple-500"
            />
            Tornar memória pública
          </label>
        </div>

        {/* Componente com Hackzinho h-0 e w-0 para o input mesmo invisivel nao ocupar espaço na tela */}
        {/* Ja devolve o coverUrl setado nele */}
        <MediaPicker setHasPreview={setHasPreview} />

        <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
          {dayjs(memory?.createdAt).format('D[ de ]MMMM[, ]YYYY')}
        </time>
        {memory?.coverUrl && !hasPreview && (
          <Image
            src={memory?.coverUrl}
            alt=""
            width={592} // Setar largura e altura toda vez que carregar uma imagem que vem de um servidor.
            height={280}
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}
        <textarea
          name="content"
          value={memoryContent}
          spellCheck="false" // eivta mostrar erros de digitação no navegador
          onChange={(e) => setMemoryContent(e.target.value)}
          className="w-full flex-1 resize-none overflow-hidden rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        >
          {memoryContent}
        </textarea>

        <button
          type="submit"
          className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
        >
          Salvar
        </button>
      </form>
    </div>
  )
}

/* 
  No Nextjs as rotas (roteamento) sao criadas automaticamente 
  ao criar arquivos 'page.tsx'dentro da estrutura da pasta app, 
  por exemplo app/login/page.tsx, bastaria acessar localhost:3000/login 
*/
