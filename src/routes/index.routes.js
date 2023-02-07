import { Router } from "express";
import { auth, createDBLocal, createTableMysql, createTableSqlite } from "../middleware/middlewares.js";
import info from "../process/info.process.js";

const indexRouter = Router();

indexRouter
  .get("/", auth, createDBLocal, createTableMysql, createTableSqlite, async (req, res) => {
    res.render("pages/home", { userLogin: req.user.username });
  })
  .get("/info", (req, res) => {
    res.render("pages/info", { info: info });
  });

export default indexRouter;
