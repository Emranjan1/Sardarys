const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2/promise");

const sequelize = new Sequelize('sardarys', 'ERahmat', 'Emranjan1415', {
  host: 'sardarys-db.cja4o6c6k14c.eu-west-2.rds.amazonaws.com', 
  port: 3306, 
  dialect: "mysql", 
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, DataTypes);
db.Product = require("./product")(sequelize, DataTypes);
db.Category = require("./category")(sequelize, DataTypes);
db.Order = require("./order")(sequelize, DataTypes); 
db.OrderItem = require("./orderItem")(sequelize, DataTypes); 
db.CustomerDetails = require("./CustomerDetails")(sequelize, DataTypes); 
db.Settings = require("./settings")(sequelize, DataTypes); 
db.PromoCode = require("./promoCode")(sequelize, DataTypes); 

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .sync() 
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Unable to create tables, shutting down...", error);
    process.exit(1);
  });

module.exports = db;