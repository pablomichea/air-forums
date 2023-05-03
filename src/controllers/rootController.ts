import { controller } from './decorators/controller.js';
import { NextFunction, Request as Req, Response as Res, Router } from 'express';
import core from 'express-serve-static-core';
import { get, post } from './decorators/routes.js';
import { use } from './decorators/use.js';
import { AppRouter } from '../AppRouter.js';
import { reqBodyCheck } from './decorators/reqBodyCheck.js';
import { boards, board, category, thread, comment, date } from '../boardInfo/boards.js';
import { users, SESSIONS } from '../boardInfo/usuarios.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import '@total-typescript/ts-reset';
import { User } from '../models/user.js';

/*
 *****************    ********************
 *****************    ********************
 */

const router = AppRouter.getRouter();

function CORS(req: Req, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
}
export interface Request<T = string> extends Req {
  body: { [key: string]: T };
  cookieInfo?: object;
  loggedUser?: Record<string, string>;
}
interface Response extends core.Response {
  render(view: TSendFile, options?: object, callback?: (err: Error, html: string) => void): void;
}
type TPugFiles = board | category | thread;
type TBaseRoutes = 'admin' | 'board' | 'threads' | 'categories' | 'index' | 'new-thread' | 'signup' | 'thread';
type TSendFile =
  | 'admin'
  | 'board'
  | 'threads'
  | 'categories'
  | 'index'
  | 'new-thread'
  | 'signup'
  | 'thread'
  | 'userProfile';

function regexedURL(str: string): string {
  if (!str) return '';
  const regex: RegExp = /^[a-z0-9-/\s.]+$/;
  //prettier-ignore
  return str.toLowerCase().replace(/\s/g,'-').split('/').filter(char => regex.test(char)).join("/")
}
function createRouterGet<TPug extends TPugFiles>(
  baseRoute: TBaseRoutes,
  routeSegment: string,
  file: TSendFile,
  options?: TPug
): Router {
  const link: string = `/${baseRoute}/${routeSegment}`;
  return router.get(link, (req: Request, res: Response) => {
    res.status(200).render(file, options);
  });
}

function getCookieInfo(req: Request, res: Response, next: NextFunction) {
  req.cookieInfo = req.headers.cookie?.split(';').reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr.split('=');
    acc[key.trim()] = value.trim();
    return acc;
  }, {});
  next();
}
/*                                    */
/*               INIT                 */
/*                                    */

function initBoardRouters(): void {
  boards.forEach((board: board): void => {
    createRouterGet<board>('board', board.link, 'categories', {
      id: board.id,
      desc: board.desc,
      title: board.title,
      link: board.link,
      categories: board.categories,
    });
    board.categories.forEach((category: category): void => {
      const link: string = board.link + '/' + category.link;
      createRouterGet<category>('board', link, 'threads', {
        id: category.id,
        desc: category.desc,
        title: category.title,
        link: category.link,
        threads: category.threads,
      });
      category.threads.forEach((thread: thread) => {
        const link: string = `${board.link}/${category.link}/${thread.link}`;
        const postDate: string = thread.date.creation;
        createRouterGet<thread>('board', link, 'thread', {
          id: thread.id,
          threadContent: thread.threadContent,
          title: thread.title,
          comments: thread.comments,
          username: thread.username,
          open: thread.open,
          date: { creation: postDate, localeUsed: thread.date.localeUsed },
          link,
        });
      });
    });
  });
}
initBoardRouters();
/*                                    */
/*              INDEX                 */
/*                                    */
@controller('')
class Index {
  @get('/')
  getIndex(req: Request<string>, res: Response): void {
    res.status(200).render('index', { title: 'Index', active: '/' });
  }
}
/*                                    */
/*              /FORO                 */
/*                                    */

@controller('/board')
class Foro {
  @get('/')
  getForo(req: Request<string>, res: Response): void {
    res.status(200).render('board', { title: 'Foro', active: 'boards', boards });
  }
  @get('/new-thread')
  getNewThread(req: Request<string>, res: Response): void {
    const userInfo = res.status(200).render('new-thread', {
      title: 'Post a thread',
      active: 'newThread',
      boards,
    });
  }
  @get('/user-profile/:profile')
  async getUserProfile(req: Request<string>, res: Response) {
    const profileName: string = req.params.profile; //cuidado con las mayusculas
    await User.find({ username: profileName })
      .then(user => {
        const { username, role, postCount, rep } = user[0];
        res.status(200).render('userProfile', { username, role, postCount, rep });
      })
      .catch(err => {
        console.log('User not found.');
        return res.status(404).render('userProfile', {}); //importante el return
      });
  }
  //crear tema
  @post('/new-thread')
  @reqBodyCheck('categoryLocation', 'postTitle', 'threadContent')
  postNewThread(req: Request<string>, res: Response): void {
    const { categoryLocation, postTitle, threadContent } = req.body;
    //busca el foro donde almacenar el post
    boards.forEach((board: board) => {
      board.categories.forEach((category: category) => {
        if (category.title === categoryLocation) {
          //prettier-ignore
          const id: number = board.categories.length - 1 + 1;
          //prettier-ignore
          const link = `${board.link}/${regexedURL(categoryLocation)}/${regexedURL(postTitle)}.${id}`;
          const threadCreationDate = new Date(Date.now()).toISOString();
          //foro/board/foro/titulo del post/id
          category.threads.push({
            id,
            username: req.loggedUser?.username || 'Invitado',
            title: postTitle,
            threadContent,
            link: `${regexedURL(postTitle)}.${id}`,
            date: { creation: `${threadCreationDate}`, localeUsed: 'check locale' }, //corregir con fetch
            open: true,
            comments: [],
          });
          //prettier-ignore
          //buscar comments en el post
          const comments: comment[] = category.threads.filter((post: thread)=> post.title === postTitle)[0].comments;
          createRouterGet<thread>('board', link, 'thread', {
            id: category.threads.length - 1 + 1,
            threadContent,
            title: postTitle,
            link: `${link}`,
            date: { creation: `${threadCreationDate}`, localeUsed: 'es-CL' }, //corregir con fetch
            comments,
            open: true,
            username: req.loggedUser?.username || 'Invitado',
          });
          res.status(201).redirect(link);
        }
      });
    });
  }
  @post('/new-comment')
  // @reqBodyCheck('commentContent', 'commentLink', 'locale')
  @use(bodyParser.json())
  async postNewComment(req: Request<string>, res: Response) {
    console.log('funciona'); //utilizar el id url#id tomar el id del elemento html
    res.json({ funciona: 'ok' });
    // const { commentContent, commentLink, locale } = req.body;
    // const postRoute = commentLink.split('/'); //////////weak
    // //busca el comment
    // const link = boards
    //   .filter((board: board) => board.link === postRoute[0])[0] //////////weak
    //   .categories.filter(
    //     (category: category) => category.link === postRoute[1] //////////weak
    //   )[0]
    //   .threads.filter((thread: thread) => thread.link === postRoute.at(-1))[0]; //////////weak
    // const commentCreationDate = new Date(Date.now()).toISOString();
    // link.comments.push({
    //   id: link.comments.length - 1 + 1,
    //   username: req.loggedUser?.username || 'Invitado',
    //   commentContent,
    //   commentLink,
    //   date: { creation: `${commentCreationDate}`, localeUsed: locale },
    // });
    // res.status(201).redirect(301, commentLink);
  }
  @post('/check-new-posts')
  @use(bodyParser.json())
  @reqBodyCheck('count', 'fromThread', 'fromRoute')
  checkNewPosts(req: Request, res: Response) {
    const { count, fromThread, fromRoute } = req.body;
    const route = fromRoute.slice().split('/').splice(2);
    const postCountDB = boards
      .filter((board: board) => board.link === route[0])[0]
      .categories.filter((category: category) => category.link === route[1])[0]
      .threads.filter((thread: thread) => thread.link === route[2])[0].comments.length;
    const newPosts = +count < postCountDB ? true : false;
    res.status(201).json({ newPosts, sendTo: req.originalUrl, fromRoute, fromThread });
  }
}
/*                                    */
/*              /ADMIN                */
/*                                    */
@controller('/admin')
class AdminPanel {
  @get('/')
  getAdminPage(req: Request<string>, res: Response): void {
    const categories: string[] = [];
    for (let forum of boards) {
      categories.push(forum.title);
    }
    res.status(200).render('admin', { title: 'Admin', active: 'admin', categories });
  }
  @post('/add-board')
  @reqBodyCheck('boardName', 'boardDesc')
  postAddBoard(req: Request<string>, res: Response): void {
    const { boardName, boardDesc } = req.body;
    const link = regexedURL(boardName);
    boards.push({
      id: boards.length - 1 + 1,
      title: boardName,
      desc: boardDesc,
      link,
      categories: [],
    });
    createRouterGet<board>('board', boardName, 'categories', {
      id: boards.length - 1 + 1,
      title: boardName,
      desc: boardDesc,
      link,
      categories: [],
    });
    res.status(201).redirect('/admin');
  }
  @post('/add-category')
  @reqBodyCheck('categoryName', 'categoryDesc', 'forumName')
  postAddCategory(req: Request<string>, res: Response): void {
    const { categoryName, categoryDesc, forumName } = req.body;

    //busca el foro donde almacenar la categoria
    const categoryLocation = boards.filter((board: board) => board.title === forumName)[0];
    const link = regexedURL(categoryName);
    categoryLocation.categories.push({
      id: categoryLocation.categories.length - 1 + 1,
      title: categoryName,
      desc: categoryDesc,
      link,
      threads: [],
    });

    const selectedCategory = categoryLocation.categories.filter(
      (category: category) => category.title === categoryName
    )[0];

    createRouterGet<category>('board', categoryLocation.link + '/' + link, 'threads', {
      id: categoryLocation.categories.length - 1 + 1,
      title: categoryName,
      desc: categoryDesc,
      link,
      threads: selectedCategory.threads,
    });
    res.status(201).redirect('/board');
  }
}
/*                                    */
/*             /SIGNUP                */
/*                                    */
@controller('/signup')
class RegisterUser {
  //GET
  @get('/')
  getSignUp(req: Request<string>, res: Response): void {
    res.status(200).render('signup', { title: 'Sign-up', active: 'signup' });
  }
  //POST
  @post('/')
  @reqBodyCheck('username', 'email', 'password')
  @use(bodyParser.json())
  async postSignUp(req: Request<string>, res: Response) {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Email already exists');
      return res.json({ error: 'Email already exists', success: false });
    }
    try {
      const hashedPassword: string = await bcrypt.hash(password, 10);
      //las operaciones en las base de datos son asincronas
      await User.build({
        username,
        email,
        password: hashedPassword,
        postCount: 0,
        rep: 0,
        role: 'user',
      })
        .save()
        .catch(err => console.error(err));
      res.cookie('isLoggedIn', 'true');
      res.cookie('username', `${username}`);
      console.log('Usuario creado');
      res.redirect(302, '/board');
    } catch (err) {
      console.log(err);
    }
  }
}
//en el servidor se bloquea la -accion- del usuario, da lo mismo si la UI fue intervenida.
//credentials:"include" envia la cookie a traves de fetch hacia el servidor
//esconder el textarea si no esta conectado el user

/* URL lado server*/
// req.protocol: http
// req.hostname: localhost
// req.get('Host'): localhost+port
// req.originalUrl: el resto de la url
// req.query: variables de la url
// req.path: ruta del pug
// req.url : ruta del pug incluyendo parametros(segmento dinamico)
// req.baseUrl: <blank>
// req.method: metodo
