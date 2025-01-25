module.exports = async function () {

  const { Sequelize } = require("sequelize");

  const path = __dirname + "./horikita.db";

  const sequelize = new Sequelize({

    dialect: "sqlite",

    host: path,

    logging: false

  });

  const userModel = require("../models/sqlite/user.js")(sequelize);

  await sequelize.sync({ force: false });

  return { userModel, sequelize };

};