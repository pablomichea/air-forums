import { Router } from 'express';

export class AppRouter {
  private static instance: Router;

  static getRouter(): Router {
    if (!this.instance) this.instance = Router();
    return this.instance;
  }
}
