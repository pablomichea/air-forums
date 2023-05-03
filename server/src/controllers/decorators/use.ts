import { RequestHandler } from 'express';
import 'reflect-metadata';

export function use(middleware: Function) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const mws: RequestHandler[] = Reflect.getMetadata('mws', target, key) || [];
    Reflect.defineMetadata('mws', [...mws, middleware], target, key);
  };
}
