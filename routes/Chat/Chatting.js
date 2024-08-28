const authUtil = require('../../response/authUtil.js');
const { Chat } = require('../../models');
const Conversation = require('./Conversation.json');
const request = require('request');
const fs = require('fs');
const path = require('path');

const Chatting = async (req, res) => {
  const { previousConversation } = req.body;
  const chatid = req.params.id;
  try {
    const ChatList = await Chat.findOne({
      where: { chatid: chatid },
    });

    if (ChatList) {
      const filePath = path.join(__dirname, '../../public', (ChatList.dataValues.chatUrl).replace(`${process.env.SERVER_ORIGIN}`, ''));

      fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to read txt');
        }

        let previousConversations = ChatList.dataValues.conversation || { ...Conversation, messages: [] };

        const systemMessageExists = previousConversations.messages.some(
          message => message.role === 'system' && message.content.some(content => content.text.includes('너는 지금부터 내 대화상대가 되어야해'))
        );

        if (!systemMessageExists) {
          previousConversations.messages.push({
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": `너는 지금부터 내 대화상대가 되어야해\n \n${data} 이 대화내용을 토대로 유저와 대화를 해줘\n \n무조건 저 대화와 비슷한 내용으로 답장을 해주고 무조건 말투도 비슷하게 해줘\n \n대화내용을 토대로 성격도 비슷하게 해줘`
              }
            ]
          });
        }

        const options = {
          uri: 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          body: previousConversations,
          json: true,
          headers: {
            'Authorization': `Bearer ${process.env.GPT_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
        };

        request.post(options, async (err, httpResponse, body) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Failed to send GPT request');
          }

          // 새로운 대화 내용 추가
          previousConversations.messages.push(
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": previousConversation
                }
              ]
            },
            {
              "role": "assistant",
              "content": [
                {
                  "type": "text",
                  "text": body.choices[0].message.content // 여기에서 body 변수가 사용됨
                }
              ]
            }
          );

          // 대화 내용을 데이터베이스에 업데이트
          await Chat.update({ conversation: previousConversations }, { where: { chatid: req.params.id } });

          res.json(body.choices[0].message.content);
        });
      });
    } else {
      return res
        .status(404)
        .send(authUtil.successTrue(404, '채팅이 존재하지 않습니다.'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(authUtil.unknownError({ error: error }));
  }
};

module.exports = Chatting;
