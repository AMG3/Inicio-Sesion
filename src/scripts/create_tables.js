import { knexMariaDB, knexSQlite } from "../options/db.js";

export async function createProductTable() {
  try {
    const isCreated = await knexMariaDB.schema.hasTable("product");
    if (isCreated) {
      console.log("La tabla de productos ya se encuentra creada en la DB");
    } else {
      await knexMariaDB.schema.createTable("product", (table) => {
        table.increments("id").primary().notNullable(),
          table.string("title", 100).notNullable(),
          table.float("price").notNullable(),
          table.string("thumbnail", 200);
      });
      console.log("La tabla de productos se creó exitosamente");
    }
  } catch (error) {
    console.error("No se pudo crear la tabla productos: ", error.message);
  }
}

export async function createMessagesTable() {
  try {
    const isCreated = await knexSQlite.schema.hasTable("message");
    if (isCreated) {
      console.log("La tabla de mensajes ya se encuentra creada en la DB");
    } else {
      await knexSQlite.schema.createTable("message", (table) => {
        table.increments("id").primary().notNullable(),
          table.timestamp("date").notNullable(),
          table.string("email", 200).notNullable(),
          table.string("name", 50).notNullable(),
          table.string("last_name", 50).notNullable(),
          table.string("age", 2).notNullable(),
          table.string("alias", 2).notNullable(),
          table.string("avatar", 2).notNullable(),
          table.string("message", 200).notNullable();
      });
      console.log("La tabla de mensajes se creó exitosamente");
    }
  } catch (error) {
    console.error("No se pudo crear la tabla de mensajes: ", error.message);
  }
}
