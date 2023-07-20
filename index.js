const express = require("express");
const cors = require("cors");
require("./db/config");
const user = require("./db/user");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
  let uuser = await new user(req.body);
  let result = await uuser.save();
  resp.send(result);
});
 
app.listen(5000);
