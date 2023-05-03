export interface date {
  creation: string;
  localeUsed: string;
  lastEdit?: string;
}
export interface board {
  id: number;
  title: string;
  desc: string;
  link: string;
  categories: Array<category>;
}
export interface category {
  id: number;
  title: string;
  desc: string;
  link: string;
  threads: Array<thread>;
}

export interface thread {
  id: number;
  username: string;
  title: string;
  threadContent: string;
  link: string;
  date: date;
  open: boolean;
  comments: Array<comment>;
}
export interface comment {
  id: number;
  username: string;
  commentContent: string;
  date: date;
  commentLink: string;
}
export const boards: Array<board> = [
  {
    id: 0,
    title: 'General',
    desc: 'Foro General',
    link: 'general',
    categories: [
      {
        id: 0,
        title: 'Consultas y Sugerencias',
        desc: 'Atención al cliente aqui.',
        link: 'consultas-y-sugerencias',
        threads: [
          {
            id: 0,
            username: 'K1ller',
            title: 'Sobre el foro',
            threadContent: 'Cualquier error enviar un pantallazo al wasap sino no podre arreglarlo.',
            link: 'sobre-el-foro.0',
            date: { creation: '2023-04-17T19:33:38.101Z', localeUsed: 'es-CL' },
            open: false,
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: 1,
    title: 'Wars',
    desc: 'Organizacion de batallas de cualquier juego.',
    link: 'wars',
    categories: [
      {
        id: 0,
        title: 'Organizacion de wars',
        desc: 'Organizacion de batallas de cualquier juego.',
        link: 'organizacion-de-wars',
        threads: [
          {
            id: 0,
            username: 'K1ller',
            title: 'Organicemos una war',
            threadContent: 'Juntemos gente en el bf y organizamos una war entre varios, que tal?',
            link: 'organicemos-una-war.0',
            date: { creation: '2023-04-13T22:05:14.00Z', localeUsed: 'es-CL' },
            open: true,
            comments: [
              {
                id: 0,
                username: 'vistoco77',
                commentContent: 'Buena idea',
                commentLink: 'post number', //link del post original + numero de post o id
                date: {
                  creation: '2023-04-13T22:09:42.00Z',
                  localeUsed: 'es-CL',
                },
              },
            ],
          },
          {
            id: 1,
            username: 'K1ller',
            title: 'Post de prueba en wars',
            threadContent: 'Ando cachando si funciona',
            link: 'post-de-prueba-en-wars.1',
            date: { creation: '2023-04-17T23:33:38.101Z', localeUsed: 'es-CL' },
            open: true,
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Juegos',
    desc: 'Para los macacos del Age of Empires',
    link: 'juegos',
    categories: [
      {
        id: 0,
        title: 'Age of empires 2',
        desc: 'Todo sobre AOE 2 HD o DE',
        link: 'age-of-empires-2',
        threads: [
          {
            id: 0,
            username: 'K1ller',
            title: 'Cuando se atascan las carretas',
            threadContent:
              'Cuando las carretas llegan al mercado de algun compañero de equipo y los mercados están todos construidos uno al lado de otro sin espacio entremedio, las carretas empiezan a no tener espacio para entrar y salir(ya que solo utilizan el frontis del mercado).\r\n\rSolucion:\r\n\rSeparar los mercados con una distancia de 1 casa, de esta forma las carretas van a utilizar los lados también(por que las carretas tambien utilizan los lados!!) y así no se van a atacar nunca, amenos que hayan demasiadas carretas.\r\n\rMal:\r\n\r<img src="" data-src="https://i.imgur.com/C5xoAd2.jpg" alt="mercados juntos">\r\n\r<img data-src="https://i.imgur.com/LaZR25q.jpg" src="" alt="la caga">\r\n\rBien:\r\n\r<img data-src="https://i.imgur.com/g2YPnI7.jpg" src="" alt="mercados separados">\r\n\rSobre el patron X: Consiste en construir 2 mercados, uno en cada extremo (osea tener mercados en los 2 extremos) y enviar manualmente las carretas en forma de X. Me refiero a que si creas 300 carretas, envías 150 de extremo "a" hacia extremo "b", y otras 150 de extremo "b" hacia extremo "a", de esta forma tienes 300 carretas llendo en ambas direcciones y no sobrecargas los mercados.\r\n\rPara evitar que choquen de frente, también puedes construir 4 mercados, osea 2 en cada lado, envias las carretas en forma paralela y así solo tienes 75 carretas llendo en una dola dirección y 300 en total!!!\r\n\r<img data-src="https://i.imgur.com/JG2upiC.jpg" src="" alt="300 carretas">\r\n\rChao noobs.',
            link: 'cuando-se-atascan-las-carretas.0',
            date: { creation: '2007-12-28T16:30:20.101Z', localeUsed: 'es-CL' },
            open: true,
            comments: [],
          },
        ],
      },
    ],
  },
];
