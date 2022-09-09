import { BaseRouter } from "../common/base.controller";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import axios from "axios";

export class MessageController extends BaseRouter {
  constructor() {
    super();

    this.bindRoutes([
      {
        path: "/send",
        method: "post",
        func: this.sendMessage,
      },
      {
        path: "/mail",
        method: "post",
        func: this.sendMail,
      },
    ]);
  }

  async sendMessage(req: Request, res: Response) {
    let fields = [
      "<b>Name</b>: " + req.body.name,
      "<b>Phone</b>: " + req.body.phone,
      "<b>Telegram</b>: " + req.body.telegram,
      req.body.message,
    ];
    let msg = "";

    fields.forEach((field) => {
      msg += field + "\n";
    });

    msg = encodeURI(msg);

    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage?parse_mode=html&text=${msg}`,
        {
          chat_id: process.env.CHAT_ID,
        }
      );

      if (response.status !== 200) {
        return res.status(400).json({ message: "Error sending" });
      }

      return res.status(200).json({
        message: "Success",
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: "Server error",
      });
    }
  }

  async sendMail(req: Request, res: Response) {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nogdire@gmail.com",
        pass: process.env.MAIL_PASS,
      },
    });

    const mailoptions = {
      from: req.body.email,
      to: "nogdire@gmail.com",
      subject: "My portfolio mail",
      text: req.body.message,
      html:
        "Message from: " +
        req.body.name +
        "<br></br>Email: " +
        req.body.email +
        "<br></br>Message: " +
        req.body.message,
    };

    try {
      const response = await transport.sendMail(mailoptions);

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: "Server error", error });
    }
  }
}
