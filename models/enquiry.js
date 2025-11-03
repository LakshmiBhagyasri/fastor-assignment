module.exports = (sequelize, DataTypes) => {
  const Enquiry = sequelize.define('Enquiry', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    courseInterest: { type: DataTypes.STRING, allowNull: false },
    claimed: { type: DataTypes.BOOLEAN, defaultValue: false },
    counselorId: { type: DataTypes.INTEGER, allowNull: true }
  })
  return Enquiry
}
