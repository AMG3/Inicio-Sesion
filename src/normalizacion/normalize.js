import { normalize, schema, denormalize } from "normalizr";
import fs from "fs";

const messagesText = fs.readFileSync("./messages.json", "utf-8");

const messages = JSON.parse(messagesText, undefined, "\t");

const authorSchema = new schema.Entity("author", { idAttribute: "email" });
const messageSchema = new schema.Entity("message", {
  author: authorSchema,
});
const messagesSchema = new schema.Entity("messages", {
  author: authorSchema,
  messages: [messageSchema],
});

const normalizedObject = normalize(messages, messagesSchema);
console.log(JSON.stringify(normalizedObject, null, "\t"));

const denormalizedObject = denormalize(
  normalizedObject.result,
  messagesSchema,
  normalizedObject.entities
);
console.log(denormalizedObject);
