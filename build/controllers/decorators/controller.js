var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import 'reflect-metadata';
import { AppRouter } from '../../AppRouter.js';
function checkBodyKeys(keys) {
    return function (req, res, next) {
        keys.forEach(function (key) {
            if (!req.body[key])
                console.error('Missing key or empty:', key);
        });
        next();
    };
}
export function controller(route) {
    return function (target) {
        var router = AppRouter.getRouter();
        for (var key in target.prototype) {
            var routeHandler = target.prototype[key];
            var path = Reflect.getMetadata('path', target.prototype, key);
            var httpMethod = Reflect.getMetadata('method', target.prototype, key);
            var middlewares = Reflect.getMetadata('mws', target.prototype, key) || [];
            var bodyKeys = Reflect.getMetadata('validate', target.prototype, key) || [];
            var bodyKeysCheck = checkBodyKeys(bodyKeys);
            if (path)
                router[httpMethod].apply(router, __spreadArray(__spreadArray([route + path], middlewares, false), [bodyKeysCheck, routeHandler], false));
        }
    };
}
