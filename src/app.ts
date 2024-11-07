import express from "express";
import { envs } from "./config";

const main = () => {
  const app = express();

  app.post("/api/github", (request, response) => {
    response.json("GitHub Endpoint");
  });

  app.listen(envs.PORT, () => {
    console.log(`server running on port ${envs.PORT} ✅`);
  });
};

(async () => {
  main();
})();
