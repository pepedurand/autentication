import { Request, Response } from "express";
import connection from "../connection";
import Authenticator from "../services/authenticator";
import { authenticationData } from "../types";

export default async function createUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, nickname } = req.body;
    const token = req.headers.authorization as string;

    if (!name && !nickname) {
      res.statusCode = 422;
      res.statusMessage = "Informe o(s) novo(s) 'name' ou 'nickname'";
      throw new Error();
    }

    if (!token) {
      res.statusCode = 422;
      res.statusMessage = "Usuário não autenticado";
      throw new Error();
    }

    const authenticator = new Authenticator();
    const tokenData = authenticator.getTokenData(token) as authenticationData;

    if (!tokenData) {
      res.statusCode = 401;
      req.statusMessage = "Token Inválido";
      throw new Error();
    }

    await connection("to_do_list_users")
      .update({ name, nickname })
      .where({ id: tokenData.id });

    res.end("Usuário atualizado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500).end();
    }

    res.end();
  }
}
