import { envs } from "../../config";

export class DiscordService {
  private readonly discordWebHookURL: string = envs.DISCORD_WEBHOOK_URL;

  constructor() {}

  async notify(message: string) {
    const body = {
      content: message,
      // embeds: [
      //   {
      //     image: {
      //       url: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMncxMTZseDAwM2RpdzN6d2w1aXNva2lsNGw1N2V2bWRleHMydjBjYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif",
      //     },
      //   },
      // ],
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
