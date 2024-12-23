import "dotenv/config"; // para que use la configuración por defecto y cargue mis variables de entorno acorde a mi archivo .env
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  PUBLIC_PATH: get("PUBLIC_PATH").default("public").asString(), // si no viene el valor usa "public" y si viene el valor entonces usa el valor que viene

  /* Discord */
  DISCORD_WEBHOOK_URL: get("DISCORD_WEBHOOK_URL").required().asString(),

  /* Secret Key de Github */
  SECRET_TOKEN: get("SECRET_TOKEN").required().asString(),
};
