const experss = require("express");
const app = experss();
const port = 5500;
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected..!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hellow World."));

app.post("/register", (req, res) => {
  // 회원 가입시 필요한 정보들을 client에서 가져와 DB에 넣어줌
  const user = new User(req.body);

  user.save((err, userInfo) => {
    // error가 있다면 client에 json 형식으로 전달해줌
    if (err) return res.json({ success: false, err });
    // 만약 성공했다면 마찬가지로 json 형식으로 전달해줌 (status(200)은 성공했다는 의미)
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
