const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  })

  Employee.beforeCreate(async (employee) => {
    employee.password = await bcrypt.hash(employee.password, 10)
  })

  return Employee
}
