import { getUser } from '@/lib/auth'
import Image from 'next/image'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      {/* Largura e Altura que a imagem externa deve ser carrega, não e a dimensçao da imagem em si. */}
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt=""
        className="h-10 w-10 rounded-full"
      />

      <p className="max-w-[140px] text-sm leading-snug">
        {name}
        <a
          href="/api/auth/logout" // Acessa a rota criada pelo Next no caminho da pasta do arquivo route.tsx api/auth/logout
          className="block text-red-400 hover:text-red-300"
        >
          Quero sair
        </a>
      </p>
    </div>
  )
}
