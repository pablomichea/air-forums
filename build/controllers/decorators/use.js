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
export function use(middleware) {
    return function (target, key, desc) {
        var mws = Reflect.getMetadata('mws', target, key) || [];
        Reflect.defineMetadata('mws', __spreadArray(__spreadArray([], mws, true), [middleware], false), target, key);
    };
}
