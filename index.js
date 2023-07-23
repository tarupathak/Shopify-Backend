const express = require("express");
const cors = require("cors");
const user = require("./db/user");
require("./db/config");
const product = require("./db/product");
const Jwt = require("jsonwebtoken");
const jwtKey = "shopify";
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", verifyToken, async (req, resp) => {
  let uuser = new user(req.body);
  let result = await uuser.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      resp.send({ result: "Something went wrong." });
    }
    resp.send({ result, auth: token });
  });
});

app.post("/login", verifyToken, async (req, resp) => {
  if (req.body.password && req.body.email) {
    let uuser = await user.findOne(req.body).select("-password");
    if (uuser) {
      Jwt.sign({ uuser }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ result: "Something went wrong." });
        }
        resp.send({ uuser, auth: token });
      });
    } else {
      resp.send({ result: "No user found" });
    }
  } else {
    resp.send({ result: "No user found" });
  }
});

app.post("/add-product", verifyToken, async (req, resp) => {
  let products = new product(req.body);
  let result = await products.save();
  resp.send(result);
});

app.get("/products", verifyToken, async (req, resp) => {
  let products = await product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "No Products Found" });
  }
});

app.delete("/product/:id", verifyToken, async (req, resp) => {
  const result = await product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get("/product-update/:id", verifyToken, async (req, resp) => {
  let result = await product.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No record found" });
  }
});

app.put("/update-product/:id", verifyToken, async (req, resp) => {
  let result = await product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  resp.send(result);
});

app.get("/search/:key", verifyToken, async (req, resp) => {
  let result = await product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  resp.send(result);
});

function verifyToken(req, resp, next) {
  const token = req.headers["autherization"];
  if (token) {
    token = token.split("")[1];
    console.warn("middleware called", token);
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        resp.send("Please provide valid token with header");
      } else {
        next();
      }
    });
  } else {
    resp.status(403).send("Please add token with header");
  }
  // console.warn("middleware called",token)
  next();
}

app.listen(8080);
