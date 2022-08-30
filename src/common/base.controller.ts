import { Router, Request, Response, NextFunction } from "express";

export interface IMiddleware {
  execute: (req: Request, res: Response, next: NextFunction) => void;
}

interface IControllerRoute {
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, "get" | "post" | "put" | "patch" | "delete">;
  middleware?: IMiddleware[];
}

export abstract class BaseRouter {
  private readonly _router: Router;

  constructor() {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      const middleware = route.middleware?.map((item) =>
        item.execute.bind(item)
      );
      const handler = route.func.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;
      this._router[route.method](route.path, pipeline);
    }
  }
}
