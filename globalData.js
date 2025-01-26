const { Model, DataTypes } = require('sequelize');

class Thread extends Model {}

Thread.init({

id: {

type: DataTypes.INTEGER,

primaryKey: true,

autoIncrement: true

},

threadId: {

type: DataTypes.STRING,

unique: true

},

channelId: {

type: DataTypes.STRING,

unique: true

},

guildId: {

type: DataTypes.STRING,

unique: true

},

message: {

type: DataTypes.STRING,

unique: true

}

}, {

sequelize,

modelName: 'Thread'

});

class User extends Model {}

User.init({

id: {

type: DataTypes.INTEGER,

primaryKey: true,

autoIncrement: true

},

userId: {

type: DataTypes.STRING,

unique: true

},

guildId: {

type: DataTypes.STRING,

unique: true

},

xp: {

type: DataTypes.INTEGER,

defaultValue: 0

},

level: {

type: DataTypes.INTEGER,

defaultValue: 0

},

money: {

type: DataTypes.INTEGER,

defaultValue: 0

},

daily: {

type: DataTypes.INTEGER,

defaultValue: 0

},

weekly: {

type: DataTypes.INTEGER,

defaultValue: 0

},

monthly: {

type: DataTypes.INTEGER,

defaultValue: 0

}

}, {

sequelize,

modelName: 'User'

});

class UserDashboard extends Model {}

UserDashboard.init({

id: {

type: DataTypes.INTEGER,

primaryKey: true,

autoIncrement: true

},

userId: {

type: DataTypes.STRING,

unique: true

},

guildId: {

type: DataTypes.STRING,

unique: true

},

xp: {

type: DataTypes.INTEGER,

defaultValue: 0

},

level: {

type: DataTypes.INTEGER,

defaultValue: 0

},

money: {

type: DataTypes.INTEGER,

defaultValue: 0

},

daily: {

type: DataTypes.INTEGER,

defaultValue: 0

},

weekly: {

type: DataTypes.INTEGER,

defaultValue: 0

},

monthly: {

type: DataTypes.INTEGER,

defaultValue: 0

}

}, {

sequelize,

modelName: 'UserDashboard'

});

class Global extends Model {}

Global.init({

id: {

type: DataTypes.INTEGER,

primaryKey: true,

autoIncrement: true

},

prefix: {

type: DataTypes.STRING,

defaultValue: '!'

},

guildId: {

type: DataTypes.STRING,

unique: true

}

}, {

sequelize,

modelName: 'Global'

});

module.exports = { Thread, User, UserDashboard, Global };