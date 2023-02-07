import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import dotenv from "dotenv";

dotenv.config();

let PORTconfigYargs;
let MODserver;
yargs(hideBin(process.argv))
  .command(
    "port <port> modo <modo>",
    "Configurar puerto para el servidor web",
    () => {},
    (argv) => {
      PORTconfigYargs = argv.port;
      MODserver = argv.modo;
    }
  )
  .command(
    "$0",
    "Puerto default port=8080, servidor modo=fork",
    () => {},
    (argv) => {
      PORTconfigYargs = 8080;
      MODserver = "fork";
    }
  )
  .demandCommand()
  .parse();

export { PORTconfigYargs, MODserver };
