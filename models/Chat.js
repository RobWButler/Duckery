module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    username: DataTypes.STRING,
    message: DataTypes.TEXT,
    createdAt: DataTypes.DATE
  });
  return Chat;
};
