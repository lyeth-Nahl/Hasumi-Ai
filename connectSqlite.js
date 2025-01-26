module.exports = async function () {

  const { Sequelize } = require("sequelize");

  const path = __dirname + "./horikita.db";

  const sequelize = new Sequelize({

    dialect: "sqlite",

    host: path,

    logging: false

  });

  const userModel = require("./globalData.js.js")(sequelize);

  await sequelize.sync({ force: false });

  return { userModel, sequelize };

};