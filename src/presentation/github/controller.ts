import { Request, Response } from "express";

export class GitHubController {
  constructor() {}

  public webHookHandler = (request: Request, response: Response) => {
    /* para probar esto se está haciendo con los PORTS nativos de Visual Studio Code porque se necesita exponer una url válida ya que con "localhost" no funcionaría en GitHub (también se puede usar ngrok). Se crea el puerto y se coloca como público, se prueba en postman si funciona y se configura los webhooks en settings del repositorio a colocar */
    /* referencia: https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks */
    // console.log("GitHub Endpoint called");
    // response.json("webHookHandler");

    /* cuando se mire en los headers que alguno empieza con "x-" usualmente es un header personalizado/propio de la plataforma que estamos usando */
    const githubEvent = request.header("x-github-event") ?? "unknown";
    // console.log({ githubEvent });

    /* NOTA: en algunos lugares o herramientas al usar sus propios webhooks, el body de la request no se verá como un objeto sino estará como un string */
    const payload = request.body;
    // console.log(payload);
    // console.log(JSON.stringify(payload)); // para crear el tipado

    response.status(201).send("Accepted");
  };
}
