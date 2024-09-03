const { Chat } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const UpdatePost = async (req, res) => {
  const chatid = req.params.id;
  const name = req.body;
  name.profileImg = req.body.profileImg;
  name.info = req.body.info;
  name.age = req.body.age;
  name.gender = req.body.gender

  try {
    await Chat.findOne({ where: { chatid: chatid } }).then(async chat => {
      if (!chat) {
        return res
          .status(401)
          .send(authUtil.successFalse(401, '게시글을 찾을 수 없습니다.'));
      }
      try {
        if (chat.userid === req.user.dataValues.userid) {
          await chat.update(req.body, { where: { chatid: chatid } });
          return res
            .status(200)
            .send(authUtil.successTrue(200, '게시글 수정 완료!'));
        } else {
          return res
            .status(401)
            .send(authUtil.successFalse(401, '게시글 작성자만 수정할 수 있습니다.'));
        }
      } catch (err) {
        return res.status(500).send(authUtil.unknownError({ error: err }));
      }
    })
  } catch (err) {
    return res.status(500).send(authUtil.unknownError({ error: err }));
  }
};

module.exports = UpdatePost;
