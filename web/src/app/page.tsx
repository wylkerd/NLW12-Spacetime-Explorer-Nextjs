export default function Home() {
  return (
    <div className="h-screen bg-zinc-950 p-6 text-zinc-50">
      <h1 className="text-4xl font-bold">Sua capsula do tempo</h1>
    </div>
  )
}

/* 
  No Nextjs as rotas (roteamento) sao criadas automaticamente 
  ao criar arquivos 'page.tsx'dentro da estrutura da pasta app, 
  por exemplo app/login/page.tsx, bastaria acessar localhost:3000/login 
*/
