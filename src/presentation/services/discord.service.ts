import { envs } from "../../config";

export class DiscordService {
  private readonly discordWebHookURL: string = envs.DISCORD_WEBHOOK_URL;

  constructor() {}

  async notify(message: string) {
    const body = {
      content: message,
    };

    const response = await fetch(this.discordWebHookURL, {
      method: "POST", // casi siempre al trabajar con webhooks es en método POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log("Error sending message to Discord");
      return false;
    }

    return true;
  }
}
