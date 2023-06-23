// Metodo GET pois estamos acessando uma url no navegador
import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

/*  
  Este GET e acionado quando o Github abre uma rota de callback, 
  ao ser acessada, o POST é feito na nossa api e guarda o Token nos Cookies por de baixo dos panos 
*/

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // Envio do GitHub code para o back-end
  const registerResponse = await api.post('/register', {
    code,
  })

  const { token } = registerResponse?.data

  const redirectURL = new URL('/', request.url) // request.url contem a url raiz da aplicação

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30

  return NextResponse.redirect(redirectURL, {
    headers: {
      // 'nomeCookie=valor; Path=/; max-age=;'
      // significa que a partir da url `/` o cookie estara disponivel em todas aplicação
      // max-age = data de eexpiracao do cookie em segundos

      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds};`,
    },
  })
}
