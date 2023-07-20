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
  result= result.toObject();
  delete result.password;
  resp.send(result);
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let uuser = await user.findOne(req.body).select("-password");
    if (uuser) {
      resp.send(uuser);
    } else {
      resp.send({ result: "No user found" });
    }
  } else {
    resp.send({ result: "No user found" });
  }
});

app.listen(5000);
