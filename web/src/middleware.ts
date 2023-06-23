import { NextRequest, NextResponse } from 'next/server'

const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

// Este middleware funcciona automaticamente no Next.js
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // request.url = qual url original o user estava tentando acessar

  if (!token) {
    return NextResponse.redirect(signInURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20;`,
      },
    })
  }

  // segue o fluxo sem outras ações
  return NextResponse.next()
}

/* Propriedade obrigatoria matcher: Especifica quais caminhos
  devem ter obrigatoriamente o usuario logado
*/
export const config = {
  matcher: '/memories/:path*',
}
