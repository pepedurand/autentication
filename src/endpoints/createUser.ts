import { Request, Response } from "express";
import connection from "../connection";
import Authenticator from "../services/authenticator";
import HashManager from "../services/hashManager";
import { IdGenerator } from "../services/idGenerator";
import { authenticationData, user } from "../types";

export default async function createUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, nickname, email, password, role } = req.body;

    if (!name || !nickname || !email || !password) {
      res.statusCode = 422;
      throw new Error(
        "Preencha os campos 'name','nickname', 'password' e 'email'"
      );
    }

    const [user] = await connection("to_do_list_users").where({ email });

    if (user) {
      res.statusCode = 409;
      throw new Error("Email já cadastrado");
    }

    if (role && role !== "admin" && role !== "normal") {
      res.statusCode = 409;
      throw new Error(
        "Insira o role do user: admin ou normal, deixe vazio para normal"
      );
    }

    const id: string = new IdGenerator().generateId();
    const hash = await new HashManager().hash(password);

    const newUser: user = { id, name, nickname, email, password: hash, role };

    await connection("to_do_list_users").insert(newUser);

    const payload: authenticationData = {
      id: newUser.id,
      role: newUser.role,
    };

    const token = new Authenticator().generateToken(payload);

    res
      .status(201)
      .send({ newUser: { id, name, nickname, email, role }, token });
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500).send({ message: "Internal server error" });
    } else {
      res.send({ message: error.message });
    }
  }
}
