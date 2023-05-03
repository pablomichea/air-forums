import { Router } from 'express';
var AppRouter = (function () {
    function AppRouter() {
    }
    AppRouter.getRouter = function () {
        if (!this.instance)
            this.instance = Router();
        return this.instance;
    };
    return AppRouter;
}());
export { AppRouter };
