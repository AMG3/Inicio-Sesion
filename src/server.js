import { dirname } from "path";
import * as http from "http";
import express from "express";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import faker from "faker";
import { Container } from "./Container.js";
import { knexMariaDB, knexSQlite } from "./options/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import userService from "./models/Users.js";
import sessionService from "./models/Session.js";
import { createHash, isValidPassword } from "./utils.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 8080;
const products = new Container(knexMariaDB, "product");
const chatMessages = new Container(knexSQlite, "message");
const connection = mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
    secret: "palabrasecreta",
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

io.on("connection", async (socket) => {
  console.log("Usuario conectado");

  const productsList = await products.getAll();
  socket.emit("startedProductList", productsList);

  const messagesList = await chatMessages.getAll();
  socket.emit("startedMessagesList", messagesList);

  socket.on("newMessage", async (data) => {
    await chatMessages.save(data);

    const messages = await chatMessages.getAll();
    io.sockets.emit("updateMessages", messages);
  });

  socket.on("addNewProduct", async (data) => {
    await products.save(data);

    const productsList = await products.getAll();
    io.sockets.emit("updateProducts", productsList);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("pages/add-product", {});
});

app.get("/products-list", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const productList = await products.getAll();
  res.render("pages/products-list", { productList });
});

app.post("/products", async (req, res) => {
  const product = req.body;
  await products.save(product);
  res.redirect("/products-list");
});

app.get("/products-test", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const productList = [];

  for (let i = 0; i < 5; i++) {
    const product = {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      image: faker.image.imageUrl(),
    };

    productList.push(product);
  }

  res.render("pages/products-test", { productList });
});

app.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }

  res.render("pages/register");
});

app.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerfail",
  }),
  async (req, res) => {
    req.user;

    res.send({ status: "success", payload: req.user._id });
  }
);

app.get("/registerfail", async (req, res) => {
  res.status(500).send({ status: "error", error: "Register failed" });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }

  res.render("pages/login");
});

app.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginfail",
  }),
  async (req, res) => {
    req.session.user = {
      name: req.user.name,
      email: req.user.email,
      id: req.user._id,
    };

    res.send({ status: "success", payload: req.session.user });
  }
);

app.get("/loginfail", (req, res) => {
  console.log("login failed");
  res.send({ status: "error", error: "Login failed" });
});

app.get("/current", (req, res) => {
  res.send(req.session.user);
});

app.get("/logout", (req, res) => {
  res
    .clearCookie("login")
    .render("pages/logout", { user: req.session.user.name });

  setTimeout(() => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/login");
      }
    });
  }, 2000);
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando puerto ${PORT}`);
});

server.on("error", (err) => console.error(err));
