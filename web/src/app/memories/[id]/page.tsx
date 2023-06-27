'use client'

import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { ChevronLeft } from 'lucide-react'
import Cookie from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NewMemoryForm } from '@/components/NewMemoryForm'

/* O Nest.js permite fazer chamadas http diretamente de componentes, 
  anotando-os como assíncronos, sem necessidade de useEffect ou estados de variáveis,
  em componentes que não recebem a anotação 'use client' */

dayjs.locale(ptBR)

interface Memory {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

export default function MemoryDetail() {
  const [memory, setMemory] = useState<Memory | null>(null)
  const token = Cookie.get('token')

  const pathname = usePathname()
  const memoryId = pathname.split('/')[2]

  async function handleGetMemory() {
    const response = await api.get(`/memories/${memoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemory(response.data)

    console.log('bateu aqui', response.data)

    if (!memory) {
      return <EmptyMemories />
    }
  }

  useEffect(() => {
    handleGetMemory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-10 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      {/* <UpdateMemoryForm /> */}
      <div key={memory?.id} className="space-y-4">
        <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
          {dayjs(memory?.createdAt).format('D[ de ]MMMM[, ]YYYY')}
        </time>
        {memory?.coverUrl && (
          <Image
            src={memory?.coverUrl}
            alt=""
            width={592} // Setar largura e altura toda vez que carregar uma imagem que vem de um servidor.
            height={280}
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}
        <p className="text-lg leading-relaxed text-gray-100">
          {memory?.content}
        </p>
        {/* <Link
          href={`/memories/${memory?.id}`}
          className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
        >
          Ler mais
          <ArrowRight className="h-4 w-4" />
        </Link> */}
      </div>
    </div>
  )
}

/* 
  No Nextjs as rotas (roteamento) sao criadas automaticamente 
  ao criar arquivos 'page.tsx'dentro da estrutura da pasta app, 
  por exemplo app/login/page.tsx, bastaria acessar localhost:3000/login 
*/
