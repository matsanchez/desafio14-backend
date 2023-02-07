import("./config/mongo.config.js");
import { PORTconfigYargs, MODserver } from "./config/yargs.config.js";
import cluster from "cluster";
import core from "os";
import msgFlash from "connect-flash";
import dontenv from "dotenv";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import userRouter from "./routes/auth/login.routes.js";
import indexRouter from "./routes/index.routes.js";
import randomsRouter from "./routes/yargs/randoms.routes.js";
import { initializePassport } from "./strategies/passport.strategy.js";
import { Manager } from "./controllers/manager.js";
import { configMysql, configSqlite } from "./config/db.config.js";
const managerProductos = new Manager(configMysql, "productos");
const managerChat = new Manager(configSqlite, "mensajes");

dontenv.config();

if (PORTconfigYargs === null) {
  PORTconfigYargs = process.env.PORT;
}

if (MODserver.toLowerCase() === "cluster" && cluster.isPrimary) {
  console.log(`>>>>> 🚀 Server Up! Port: ${PORTconfigYargs} 💻 Server modo: ${MODserver.toLowerCase()}`);
  for (let i = 0; i < core.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on("exit", () => {
    cluster.fork();
  });
} else {
  if (MODserver != "cluster") {
    console.log(`>>>>> 🚀 Server Up! Port: ${PORTconfigYargs} 💻 Server modo: ${MODserver.toLowerCase()}`);
  }
  const app = express();
  const server = app.listen(PORTconfigYargs, () => {
    console.log(`>>>>> 👼 Proceso N°: ${process.pid}`);
  });

  app.use(express.static("src/public"));
  app.use(express.json());
  app.use(msgFlash());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      store: MongoStore.create({ mongoUrl: process.env.MONGO_STORE }),
      key: process.env.MONGO_STORE_KEY,
      secret: process.env.MONGO_STORE_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 600000,
      },
    })
  );
  initializePassport();
  app.use(passport.initialize());
  app.use(passport.session());
  app.engine(
    "hbs",
    handlebars.engine({
      extname: ".hbs",
    })
  );
  app.set("views", "./src/public/views");
  app.set("view engine", "hbs");
  app.use("/", indexRouter);
  app.use("/api/auth/", userRouter);
  app.use("/api/randoms", randomsRouter);
  app.use((req, res) => {
    res
      .status(404)
      .render("pages/404", { error: `ruta ${req.baseUrl} ${req.url} metodo ${req.method} no implementada` });
  });

  const io = new Server(server);

  io.on("connection", async (socket) => {
    console.log("🔛 Usuario Conectado");

    const loadProducts = async () => {
      const products = await managerProductos.getAll();
      const logChat = await managerChat.getAll();
      socket.emit("server:loadProducts", products);
      socket.emit("server:loadMessages", logChat);
    };
    loadProducts();

    const refreshList = async () => {
      const products = await managerProductos.getAll();
      io.emit("server:loadProducts", products);
    };

    socket.on("client:newProduct", async (obj) => {
      let id = await managerProductos.create(obj);
      let product = await managerProductos.getById(id);
      io.emit("server:newProduct", product);
    });

    socket.on("client:newMessage", async (obj) => {
      let id = await managerChat.create(obj);
      let message = await managerChat.getById(id);
      io.emit("server:newMessage", message);
    });

    socket.on("client:deleteProduct", async (id) => {
      await managerProductos.deleteById(id);
      refreshList();
    });

    socket.on("client:updateProduct", async (id) => {
      let prodId = await managerProductos.getById(id);
      socket.emit("server:updateProduct", prodId);
    });

    socket.on("cliente:sendUpdateProduct", async (prod) => {
      await managerProductos.updateById(prod);
      refreshList();
    });
  });
}
