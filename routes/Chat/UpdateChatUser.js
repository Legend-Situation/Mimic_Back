const { Chat } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const UpdatePost = async (req, res) => {
  const chatid = req.params.id;
  let data = {}; 

  await Chat.findOne({ where: { chatid: chatid } }).then(async chat => {
    if (!chat) {
      return res
        .status(401)
        .send(authUtil.successFalse(401, '게시글을 찾을 수 없습니다.'));
    } else {
      data = {
        name: req.body.name,
        profileImg: req.body.profileImg,
        info: req.body.info,
        age: req.body.age,
        // conversation,
        // chatUrl,
        // previousConversationTarget
      };
    }
    if (chat.userid === req.user.dataValues.userid) {
      await chat.update(data, { where: { chatid: chatid } });
      return res
        .status(200)
        .send(authUtil.successTrue(200, '게시글 수정 완료!'));
    } else {
      return res
        .status(401)
        .send(authUtil.successFalse(401, '게시글 작성자만 수정할 수 있습니다.'));
    }
  });
};

module.exports = UpdatePost;
