const express = require("express");

const cors = require("cors");

const Routes = "./routes";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      payment: '/api/process-payment',
    }

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicación
    this.routes();
  }

  middlewares() {
    this.app.use((express.json({ limit: '50mb' })));
    this.app.use((express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })));
    //cors
    this.app.use(cors());
    //lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static('src/public'));

  }

  routes() {
    this.app.use(
      this.paths.payment,
      require(`${Routes}/cardinal.route`)
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}
module.exports = Server;
