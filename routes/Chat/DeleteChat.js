const authUtil = require('../../response/authUtil.js');
const {Chat} = require('../../models');

const GetChatLog = async (req, res) => {
  const chatid = req.params.id;
  try {
    const ChatLog = await Chat.findOne({
      where: {chatid: chatid},
    });

    if (ChatLog) {
      if (ChatLog.userid === req.user.dataValues.userid) {
        await Chat.destroy({where: {chatid: chatid}});
        return res
          .status(200)
          .send(authUtil.successTrue(200, '채팅을 삭제했습니다.', ChatLog));
      } else {
        return res
          .status(403)
          .send(authUtil.successFalse(403, '해당 채팅 로그에 접근할 수 없습니다.'));
      }
    } else {
      return res
        .status(404)
        .send(authUtil.successFalse(404, '채팅을 찾을 수 없습니다.'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(authUtil.unknownError({error: error}));
  }
};

module.exports = GetChatLog;
