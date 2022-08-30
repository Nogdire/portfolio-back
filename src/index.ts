import { App } from "./app";
import { MessageController } from "./message/message.controller";
import dotenv from "dotenv";

async function main() {
  dotenv.config();

  const app = new App(new MessageController());
  await app.init();
}

main();
