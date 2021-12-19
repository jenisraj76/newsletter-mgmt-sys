import http from "http";
import express from "express";
import dotenv = require('dotenv');
dotenv.config();
import routes from "./api";
import loader from "./loaders";
import parser from "body-parser";
import compression from "compression";
process.on("uncaughtException", e => {
  console.log(e);
});

process.on("unhandledRejection", e => {
  console.log(e);
});

export const serverError = (err: any, res: express.Response, next: express.NextFunction) =>
{
  console.error(err);
  if (process.env.NODE_ENV === "production")
  {
    res.status(500).send("Internal Server Error");
  } else
  {
    res.status(500).send(err.stack);
  }
};

const createServer = () => {
  const app = express();
  app.use(parser.urlencoded({ limit: "1mb", extended: true }));
  app.use(parser.json({ limit: "1mb" }));
  app.use(compression());
  app.use('/api', routes);
  routes.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    serverError(err, res, next);
  });
  const server = http.createServer(app);

  server.listen(3000, () => {
    console.log(`Server is Started http://localhost:3000...`);
  });
}
loader().then(createServer);



