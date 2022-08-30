import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";
import { MessageController } from "./message/message.controller";

export class App {
  app: Express;
  port: number | string;
  server: Server;
  messageController: MessageController;

  constructor(messageController: MessageController) {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.messageController = messageController;
  }

  useRoutes() {
    this.app.use("/message", this.messageController.router);
  }

  public async init() {
    this.app.use(express.json());
    this.app.use(cors());
    this.useRoutes();
    this.server = this.app.listen(this.port);
    console.log(`Server running on http://loaclhost:${this.port} port`);
  }
}
