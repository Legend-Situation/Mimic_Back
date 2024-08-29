const authUtil = require('../../response/authUtil');

const LoginState = async (req, res) => {
	return res.status(200).send(
		authUtil.successTrue(200, '회원상태 조회완료', {
			userid: req.user.dataValues.userid,
			name: req.user.dataValues.name,
			age: req.user.dataValues.age,
			gender: req.user.dataValues.gender
		})
	);
};
module.exports = LoginState;
