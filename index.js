const experss = require("express");
const app = experss();
const port = 5500;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

// application/x-www-form-urlencoded를 파싱하기 위함
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected..!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello !"));

// 회원가입
app.post("/api/users/register", (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일이 DB에 존재하는지 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "ID 또는 비밀번호가 틀립니다.",
      });
    }
    // 요청된 이메일이 DB에 있다면, 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "ID 또는 비밀번호가 틀렸습니다.",
        });
      // 비밀번호가 맞다면 토큰 생성
      user.generateToken((err, user) => {
        //status(400)은 에러가 있다는 뜻
        if (err) return res.status(400).send(err);

        // 토큰을 저장. (쿠키, 로컬스토리지)
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // 미들웨어인 auth를 통과해서 왔다는 것은 Authentication이 True라는 뜻.
  res.status(200).json({
    _id: req.user._id,
    // role = 0 -> 일반유저, role != 0 -> 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    imgae: req.user.imgae,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
