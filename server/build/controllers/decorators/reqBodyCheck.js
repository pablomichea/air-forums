import 'reflect-metadata';
export function reqBodyCheck() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return function (target, key, desc) {
        Reflect.defineMetadata('validate', values, target, key);
    };
}
