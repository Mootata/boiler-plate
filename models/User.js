const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    // 유저의 이름
    type: String,
    maxlength: 50,
  },
  email: {
    // 유저의 이메일
    type: String,
    trim: true, // 공백을 없애줌 ex) dbslt 33@naver.com => dbslt33@naver.com
    unique: 1, // 이메일 중복 방지
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    // 관리자와 일반유저의 구분을 위해서
    type: Number,
    default: 0, // 따로 설정해주지 않으면 0으로 설정되도록.
  },
  image: String,
  token: {
    // 토큰을 이용해 유효성같은 것을 관리
    type: String,
  },
  tokenExp: {
    // 토큰의 유효기간
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // error 발생시
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        // error 발생시
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema); // userSchema를 model로 감싸줌

module.exports = { User }; // 이 모델을 다른 파일에서도 쓸 수 있도록 exports
