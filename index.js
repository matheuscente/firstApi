const express = require("express");
const database = require("./src/DataBase.js");
const routeInventory = require("./src/routes/Inventory.js");
const routeUser = require("./src/routes/User.js");
const routeProduct = require("./src/routes/Product.js");
const routeOrganization = require("./src/routes/Organization.js");
const routeMovement = require("./src/routes/InventoryMovement.js");
const routeSession = require("./src/routes/session.js")
const apiUser = require('./src/controllers/User.js')
require("dotenv").config({ path: "./config.env" });

const port = process.env.LISTEN_PORT;
const app = express();

app.use(express.json());

//routes that don't need authentication
app.post("/api/v1/login", apiUser.login);

//routes that need authentication

app.use("/api/v1/session")
app.use("/api/v1/inventory", routeInventory);
app.use("/api/v1/organization", routeOrganization);
app.use("/api/v1/product", routeProduct);
app.use("/api/v1/inventoryMovement", routeMovement);
app.use("/api/v1/user", routeUser);

database.db
  .sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.info(`app running in ${port} port`);
    });
  })
  .catch((e) => {
    console.error(`a error was ocorred: ${e}`);
  });
