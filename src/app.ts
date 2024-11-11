import express from "express";
import { envs } from "./config";
import { GitHubController } from "./presentation/github/controller";
import { GithubSha256Middleware } from "./presentation/middlewares/github-sha256.middleware";

const main = () => {
  const app = express();

  const gitHubController = new GitHubController();

  app.use(express.json());

  app.use(GithubSha256Middleware.verifySignature);

  app.post("/api/github", gitHubController.webHookHandler);

  app.listen(envs.PORT, () => {
    console.log(`server running on port ${envs.PORT} ✅`);
  });
};

(async () => {
  main();
})();
