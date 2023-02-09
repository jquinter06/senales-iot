export class UserData {
  iss: string
  iat: number
  exp: number
  user: User
}
export class Company {
  activo: string
  codigo: string
  direccion: string
  empresa: number
  logger: string
  nit: string
  nombre: string
  telefono: string
}
export class User {
  avatar: string
  usuario: string
  nombre: string
  clave: string
  cargo: string
  fechamodif: string
  periodo: number
  visible: string
  rol: string
  perfil: string
  nombrerol: string
  nombreperfil: string
  caducado: string
  correo: string
  telefono: string
  correoactivo: boolean
  empresas: [Company]
}
