/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', '192.168.0.109', 'localhost'], // Adicionar aqui o endereço externo da imagem que vem de outra aplicação
  },
}

module.exports = nextConfig
