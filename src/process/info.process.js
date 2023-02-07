import core from "os";

let info = {
  _1: {
    title: "Argumento de Entradas",
    description: process.argv,
  },
  _2: {
    title: "Sistema Operativo",
    description: process.platform,
  },
  _3: {
    title: "Version Node JS",
    description: process.version,
  },
  _4: {
    title: "Memoria Total Reservada(rss)",
    description: process.memoryUsage().rss,
  },
  _5: {
    title: "Path de Ejecucion",
    description: process.execPath,
  },
  _6: {
    title: "Process Id",
    description: process.pid,
  },
  _7: {
    title: "Carpeta del Proyecto",
    description: process.cwd(),
  },
  _8: {
    title: "Cantida de Procesadores",
    description: core.cpus().length,
  },
};

export default info;
