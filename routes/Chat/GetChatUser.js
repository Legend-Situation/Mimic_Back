const { Chat } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const UpdatePost = async (req, res) => {
  const chatid = req.params.id;

  await Chat.findOne({ where: { chatid: chatid } }).then(async chat => {
    if (!chat) {
      return res
        .status(401)
        .send(authUtil.successFalse(401, '유저를 찾을 수 없습니다.'));
    }
    if (chat.userid === req.user.dataValues.userid) {
      return res
        .status(200)
        .send(authUtil.successTrue(200, '유저를 찾았습니다.', chat));
    } else {
      return res
        .status(401)
        .send(authUtil.successFalse(401, '게시글 작성자만 수정할 수 있습니다.'));
    }
  });
};

module.exports = UpdatePost;
