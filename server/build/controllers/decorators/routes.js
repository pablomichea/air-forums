import 'reflect-metadata';
function routeBind(method) {
    return function (path) {
        return function (target, key, desc) {
            Reflect.defineMetadata('path', path, target, key);
            Reflect.defineMetadata('method', method, target, key);
        };
    };
}
export var get = routeBind('get');
export var post = routeBind('post');
