module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    'Chat',
    {
      chatid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      info: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      conversation: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      chatUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      previousConversationTarget: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userid: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );

  Chat.associate = db => {
    db.Chat.belongsTo(db.Users, {
      foreignKey: { name: 'userid', allowNull: false },
      targetKey: 'userid',
    });
  };

  return Chat;
};
