import { createProductTable, createMessagesTable } from "./create_tables.js";

async function buildDatabase() {
  await createProductTable();
  await createMessagesTable();
}

buildDatabase();
