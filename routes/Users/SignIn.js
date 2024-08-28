const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../tokens/jwt.js');

const SignIn = async (req, res) => {
  const { userid, password } = req.body;

  try {
    const user = await Users.findOne({ where: { userid: userid } });

    if (!user) {
      return res.status(401).send(authUtil.successTrue(401, '존재하지 않는 아이디입니다.'));
    }

    bcrypt.compare(password, user.password).then(async match => {
      if (!match) {
        return res
          .status(401)
          .send(authUtil.successFalse(401, '비밀번호가 일치하지 않습니다.'));
      }

      // accessToken 발급및 Respond
      const accessToken = generateAccessToken(userid);
      const refreshToken = generateRefreshToken(userid);

      await Users.update(
        { refreshToken: refreshToken },
        { where: { userid: userid } }
      );
      return res
        .status(200)
        .send(authUtil.jwtSent(200, '로그인 성공', accessToken, refreshToken));
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(authUtil.unknownError({ error: err }));
  }
};

module.exports = SignIn;
