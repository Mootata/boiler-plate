const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema); // userSchema를 model로 감싸줌

module.exports = { User }; // 이 모델을 다른 파일에서도 쓸 수 있도록 exports
