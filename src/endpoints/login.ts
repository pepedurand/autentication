import { Request, Response } from "express";
import connection from "../connection";
import Authenticator from "../services/authenticator";
import HashManager from "../services/hashManager";
import { authenticationData } from "../types";

export default async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Por favor, preencha seus dados corretamente.");
    }
    const [user] = await connection("to_do_list_users").where({ email });

    const correctPassword = await new HashManager().compare(
      password,
      user.password
    );

    if (!correctPassword) {
      throw new Error("senha incorreta");
    }
    if (!user) {
      throw new Error("Credenciais de acesso inválidas!");
    }

    const payload: authenticationData = {
      id: user.id,
      role: user.role,
    };

    const token = new Authenticator().generateToken(payload);

    res.status(201).send({ token });
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error);
  }
}
