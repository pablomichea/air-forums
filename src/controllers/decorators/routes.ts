import 'reflect-metadata';

export type httpMethods = 'get' | 'post';

function routeBind(method: httpMethods) {
  return function (path: string) {
    return function (target: any, key: string, desc: PropertyDescriptor) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', method, target, key);
    };
  };
}
export const get = routeBind('get');
export const post = routeBind('post');
