const express = require("express");
require("./db/config");
const user = require("./db/user");
const app = express();
app.use(express.json());

app.post("/register", async (req, resp) => {
  let uuser = await new user(req.body);
  let result = await uuser.save();
  resp.send(result);
});

app.listen(5000);
