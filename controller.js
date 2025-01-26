 const { User } = require('./');

async function createUser(data) {

  try {

    const user = await  User.create({

      nama_fb: data.nama_fb,

      id_costum: data.id_costum,

      yen: data.yen,

      exp: data.exp,

      level: data.level

    });

    return user;

  } catch (error) {

    console.error(error);

  }

}

async function getUser(id) {

  try {

    const user = await User.findOne({ where: { id } });

    return user;

  } catch (error) {

    console.error(error);

  }

}

async function updateUser(id, data) {

  try {

    const user = await User.update(data, { where: { id } });

    return user;

  } catch (error) {

    console.error(error);

  }

}

async function deleteUser(id) {

  try {

    const user = await User.destroy({ where: { id } });

    return user;

  } catch (error) {

    console.error(error);

  }

}

module.exports = { createUser, getUser, updateUser, deleteUser };
// ThreadController

async createThread(data) {

try {

const thread = await Thread.create(data);

return thread;

} catch (error) {

console.error(error);

}

}

async getThread(id) {

try {

const thread = await Thread.findOne({ where: { id } });

return thread;

} catch (error) {

console.error(error);

}

}

async updateThread(id, data) {

try {

const thread = await Thread.update(data, { where: { id } });

return thread;

} catch (error) {

console.error(error);

}

}

async deleteThread(id) {

try {

const thread = await Thread.destroy({ where: { id } });

return thread;

} catch (error) {

console.error(error);

}

}

// UserDashboardController

async createUserDashboard(data) {

try {

const userDashboard = await UserDashboard.create(data);

return userDashboard;

} catch (error) {

console.error(error);

}

}

async getUserDashboard(id) {

try {

const userDashboard = await UserDashboard.findOne({ where: { id } });

return userDashboard;

} catch (error) {

console.error(error);

}

}

async updateUserDashboard(id, data) {

try {

const userDashboard = await UserDashboard.update(data, { where: { id } });

return userDashboard;

} catch (error) {

console.error(error);

}

}

async deleteUserDashboard(id) {

try {

const userDashboard = await UserDashboard.destroy({ where: { id } });

return userDashboard;

} catch (error) {

console.error(error);

}

}

// GlobalController

async createGlobal(data) {

try {

const global = await Global.create(data);

return global;

} catch (error) {

console.error(error);

}

}

async getGlobal(id) {

try {

const global = await Global.findOne({ where: { id } });

return global;

} catch (error) {

console.error(error);

}

}

async updateGlobal(id, data) {

try {

const global = await Global.update(data, { where: { id } });

return global;

} catch (error) {

console.error(error);

}

}

async deleteGlobal(id) {

try {

const global = await Global.destroy({ where: { id } });

return global;

} catch (error) {

console.error(error);

}

}

}

module.exports = Controller;