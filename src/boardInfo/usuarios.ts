export interface user {
  id: number;
  username: string;
  email: string;
  password: string;
  postCount: number;
  rep: number;
  role: 'anon' | 'user' | 'mod' | 'admin';
}
export const SESSIONS = new Map<string, string>();

export const users: user[] = [
  { id: 0, username: 'K1ller', email: 'pablomichea@live.cl', password: 'caca', role: 'admin', postCount: 549, rep: 0 },
  { id: 1, username: 'vistoco77', email: 'vistoco77@gmail.com', password: '', role: 'admin', postCount: 0, rep: 0 },
];

//dar idea de nombre de usuario y mostrar fotos para el perfil
