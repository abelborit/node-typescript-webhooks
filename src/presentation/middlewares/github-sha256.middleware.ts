/* FORMA 1 */
import { NextFunction, Request, Response } from "express";
import * as crypto from "crypto";
import { envs } from "../../config";

let encoder = new TextEncoder();

async function verify_signature(
  secret: string,
  header: string,
  payload: string
): Promise<boolean> {
  const parts = header.split("=");
  const sigHex = parts[1];

  const algorithm: any = {
    name: "HMAC",
    hash: { name: "SHA-256" },
  };

  const keyBytes = encoder.encode(secret);
  const extractable = false;
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    algorithm,
    extractable,
    ["sign", "verify"]
  );

  const sigBytes = hexToBytes(sigHex);
  const dataBytes = encoder.encode(payload);
  const equal = await crypto.subtle.verify(
    algorithm.name,
    key,
    sigBytes,
    dataBytes
  );

  return equal;
}

function hexToBytes(hex: string = ""): Uint8Array {
  const len = hex.length / 2;
  const bytes = new Uint8Array(len);

  let index = 0;
  for (let i = 0; i < hex.length; i += 2) {
    const c = hex.slice(i, i + 2);
    const b = parseInt(c, 16);
    bytes[index] = b;
    index += 1;
  }

  return bytes;
}

export class GithubSha256Middleware {
  static verifySignature = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const xHubSignature = req.header("x-hub-signature-256") ?? "";
    const signature = xHubSignature;

    if (
      !(await verify_signature(
        envs.SECRET_TOKEN,
        signature,
        JSON.stringify(req.body)
      ))
    ) {
      res.status(401).send("Unauthorized");
      return;
    }

    next();
  };
}

/* FORMA 2 */
// import crypto from "crypto";
// import { NextFunction, Request, Response } from "express";
// import { envs } from "../../config";

// const secretKey = envs.SECRET_TOKEN;

// export class GithubSha256Middleware {
//   static verifySignature = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const expectedSignature =
//       "sha256=" +
//       crypto
//         .createHmac("sha256", secretKey)
//         .update(JSON.stringify(req.body))
//         .digest("hex");

//     const signature = req.headers["x-hub-signature-256"];
//     if (signature !== expectedSignature) {
//       return res.status(401).send("Unauthorized");
//     }

//     next();
//   };
// }
