const experss = require("express");
const app = experss();
const port = 5500;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://dbslt6872:kang!165@algorithm-diary.ibzfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected..!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hellow World."));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
