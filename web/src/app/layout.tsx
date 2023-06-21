import { ReactNode } from 'react'
import './globals.css'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google' // Evita o Layout Shit das fontes (carregamento lento da fonte)

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' }) // nome da variavel no CSS para aplicar no Tailwind

const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree', // nome da variavel no CSS para aplicar no Tailwind
})

export const metadata = {
  title: 'NLW Spacetime',
  description:
    'Uma cápsula do tempo contruida com React, Next.js, Tailwind e Typescript.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${baiJamjuree.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
