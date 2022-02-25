const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리를 하는 곳

  // 클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth;
  // 토큰을 복호화해서 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    // index.js의 get('/api/users/auth') 에서 token과 user를 사용하기 위해서 씀
    req.token = token;
    req.user = user;
    next();
  });
  // 유저가 있다면 인증 ok

  // 유저가 없다면 인증 no
};

module.exports = { auth };
