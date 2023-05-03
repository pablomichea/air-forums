import 'reflect-metadata';

export function reqBodyCheck(...values: string[]): Function {
  return function (target: Function, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata('validate', values, target, key);
  };
}
