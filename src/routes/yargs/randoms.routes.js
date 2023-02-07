import { Router } from "express";
import { fork } from "child_process";
const randomsRouter = Router();

randomsRouter.get("/", (req, res) => {
  let cantidad = parseInt(req.query.cant);
  if (isNaN(cantidad) || cantidad === 0) {
    cantidad = 100000000;
  }
  let result = fork("./src/process/random.process");
  result.send(cantidad);
  result.on("message", (data) => {
    res.render("pages/randoms", { result: data, cantidad: cantidad });
  });
});

export default randomsRouter;
