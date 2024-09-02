const authUtil = require('../../response/authUtil.js');
const { Chat } = require('../../models');

const GetChatList_All = async (req, res) => {
  try {
    const ChatList = await Chat.findAll({
      where: { userid: req.user.dataValues.userid },
    });

    if (ChatList && ChatList.length > 0) {
      return res
        .status(200)
        .send(authUtil.successTrue(200, '채팅을 찾았습니다.', ChatList));
    } else {
      return res
        .status(404)
        .send(authUtil.successFalse(404, '채팅을 찾을 수 없습니다.'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(authUtil.unknownError({ error: error }));
  }
};

module.exports = GetChatList_All;
