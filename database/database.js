const Sequelize = require('sequelize')

const connection = new Sequelize('blogdb', 'root', '0157', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection