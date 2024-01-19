const WaClient = require("./src/client/client");
const client = new WaClient();
client.connect();
// or
// client.connect("local");
// to save session without mongodb
