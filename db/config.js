const mongoose = require("mongoose");

const mongodbUrl =
  "mongodb+srv://pathaktaru2002:12345@cluster0.yb85zcz.mongodb.net/Shopify";

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
});
``;

mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb...");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});
