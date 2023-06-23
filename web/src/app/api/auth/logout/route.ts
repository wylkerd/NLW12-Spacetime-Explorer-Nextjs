// Metodo GET pois estamos acessando uma url no navegador
import { NextRequest, NextResponse } from 'next/server'

/*  
  Este GET e acionado por de baixo dos panos, redireciona para pagina inicial
*/
export async function GET(request: NextRequest) {
  const redirectURL = new URL('/', request.url) // request.url contem a url raiz da aplicação 'Home'

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=; Path=/; max-age=0;`, // Excluindo cookie do navegador
    },
  })
}
