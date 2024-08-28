const authUtil = require('../../response/authUtil.js');
const { Chat } = require('../../models')

const CreateUser = async (req, res) => {
  const { name, profileImg, chatUrl, info, previousConversationTarget } = req.body;

  try {
    await Chat.create({
      name: name,
      profileImg: profileImg,
      info: info,
      chatUrl: chatUrl,
      previousConversationTarget: previousConversationTarget,
      userid: req.user.dataValues.userid
    })
    return res
      .status(200)
      .send(authUtil.successTrue(200, '유저 생성에 성공하였습니다.'));
  } catch (error) {
    console.error(error);
    return res.status(500).send(authUtil.unknownError({ error: error }));
  }
}

module.exports = CreateUser;