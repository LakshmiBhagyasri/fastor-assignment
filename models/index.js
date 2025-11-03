const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  storage: process.env.DB_STORAGE,
  logging: false
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.Employee = require('./employee')(sequelize, Sequelize)
db.Enquiry = require('./enquiry')(sequelize, Sequelize)

db.Employee.hasMany(db.Enquiry, { foreignKey: 'counselorId' })
db.Enquiry.belongsTo(db.Employee, { foreignKey: 'counselorId' })

module.exports = db
