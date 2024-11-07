import express from "express";
import { envs } from "./config";
import { GitHubController } from "./presentation/github/controller";

const main = () => {
  const app = express();

  const gitHubController = new GitHubController();

  app.post("/api/github", gitHubController.webHookHandler);

  app.listen(envs.PORT, () => {
    console.log(`server running on port ${envs.PORT} ✅`);
  });
};

(async () => {
  main();
})();
