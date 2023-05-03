import 'reflect-metadata';
import { AppRouter } from '../../AppRouter.js';
// import { Method } from '../../util/MetadataKeys.js';
import { httpMethods } from './routes.js';
import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';

function checkBodyKeys(keys: string[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    keys.forEach((key: string) => {
      if (!req.body[key]) console.error('Missing key or empty:', key);
    });
    next();
  };
}

export function controller(route: string) {
  return function (target: Function) {
    const router = AppRouter.getRouter();
    for (let key in target.prototype) {
      const routeHandler: RequestHandler = target.prototype[key];
      const path: string = Reflect.getMetadata('path', target.prototype, key);
      //prettier-ignore
      const httpMethod: httpMethods = Reflect.getMetadata('method', target.prototype, key);
      //prettier-ignore
      const middlewares: RequestHandler[] = Reflect.getMetadata('mws', target.prototype, key) || [];
      //prettier-ignore
      const bodyKeys: string[] = Reflect.getMetadata('validate', target.prototype, key) || [];
      const bodyKeysCheck: RequestHandler = checkBodyKeys(bodyKeys);
      //prettier-ignore
      if (path) router[httpMethod](route + path, ...middlewares, bodyKeysCheck, routeHandler);
    }
  };
}
