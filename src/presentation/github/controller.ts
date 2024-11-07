import { Request, Response } from "express";

export class GitHubController {
  constructor() {}

  public webHookHandler = (request: Request, response: Response) => {
    /* para probar esto se está haciendo con los PORTS nativos de Visual Studio Code porque se necesita exponer una url válida ya que con "localhost" no funcionaría en GitHub (también se puede usar ngrok). Se crea el puerto y se coloca como público, se prueba en postman si funciona y se configura los webhooks en settings del repositorio a colocar */
    /* referencia: https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks */
    console.log("GitHub Endpoint called");

    response.json("webHookHandler");
  };
}
