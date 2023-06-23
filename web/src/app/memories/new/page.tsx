import { Camera, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

/* De acordo com a hierarquia das pastas a url desta pagina sera /memories/new */
export default function NewMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      <form className="flex flex-1 flex-col gap-2">
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
              name="isPublic"
              id="isPublic"
              value="true"
              // Estilização do checkbox com a lib @tailwindcss/forms
              className="h-4 w-4 rounded border-gray-700 bg-gray-700 text-purple-500"
            />
            Tornar memória pública
          </label>
        </div>

        {/* Hackzinho h-0 e w-0 para o input mesmo invisivel nao ocupar espaço na tela */}
        <input type="file" id="media" className="invisible h-0 w-0" />

        <textarea
          name="content"
          spellCheck="false" // eivta mostrar erros de digitação no navegador
          className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />
      </form>
    </div>
  )
}
