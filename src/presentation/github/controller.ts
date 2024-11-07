import { Request, Response } from "express";
import { GitHubService } from "../services/github.service";

export class GitHubController {
  constructor(private readonly gitHubService = new GitHubService()) {}

  public webHookHandler = (request: Request, response: Response) => {
    /* para probar esto se está haciendo con los PORTS nativos de Visual Studio Code porque se necesita exponer una url válida ya que con "localhost" no funcionaría en GitHub (también se puede usar ngrok). Se crea el puerto y se coloca como público, se prueba en postman si funciona y se configura los webhooks en settings del repositorio a colocar */
    /* referencia: https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks */
    // console.log("GitHub Endpoint called");
    // response.json("webHookHandler");

    /* cuando se mire en los headers que alguno empieza con "x-" usualmente es un header personalizado/propio de la plataforma que estamos usando */
    const githubEvent = request.header("x-github-event") ?? "unknown";
    // console.log({ githubEvent });

    /* NOTA: en algunos lugares o herramientas al usar sus propios webhooks, el body de la request no se verá como un objeto sino estará como un string */
    /* NOTA: tener en consideración que el payload viene de tipo any porque no estamos colocando nada pero se podría hacer un mapper (como el la función fromObject que hicimos en ejercicios anteriores el cual es un método o función que toma un objeto y lo transforma en una instancia de una clase particular) para saber que sí o sí tendrán las propiedades que necesitamos porque ahora solo estamos confiando en que sí regresará lo que necesitamos y que en el "gitHubService.onStar" recibirá un payload de tipo GitHubStarPayload lo cual puede o no ser cierto, pero por fines prácticos lo dejaremos así pero se podría hacer un mapper */
    const payload = request.body;
    // console.log(payload);
    // console.log(JSON.stringify(payload)); // para crear el tipado

    let message: string;

    switch (githubEvent) {
      case "star":
        message = this.gitHubService.onStar(payload);
        break;

      case "issues":
        message = this.gitHubService.onIssues(payload);
        break;

      default:
        // console.log(`Unkown Event ${githubEvent}`);
        message = `Unkown Event ${githubEvent}`;
        break;
    }

    console.log({ message });
    response.status(201).send("Accepted");
  };
}
