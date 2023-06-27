import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.0.109:3333', // Verificar Ipv4 do PC antes de rodar
  // Caso tenha mudado o localhost, alterar no Apllication mobile do Github
  // Exemplo: exp://192.168.0.109:19000
})
