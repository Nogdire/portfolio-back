import { App } from "./app";
import { MessageController } from "./message/message.controller";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const app = new App(new MessageController());
  await app.init();
}

main();
