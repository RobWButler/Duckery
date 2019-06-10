module.exports = function(sequelize, DataTypes) {
  var Duck = sequelize.define('Duck', {
    head: DataTypes.TEXT,
    body: DataTypes.TEXT,
    bill: DataTypes.TEXT,
    hat: DataTypes.TEXT,
    headgradient: DataTypes.TEXT,
    headpattern: DataTypes.TEXT,
    billpattern: DataTypes.TEXT,
    bodygradient: DataTypes.TEXT,
    bodypattern: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
  return Duck;
};
