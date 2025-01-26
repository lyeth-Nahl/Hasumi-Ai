//_Index.js_by Nahl

const express = require('express');

const app = express();

const cors = require('cors');

const { User, Thread, Dashboard, GlobalData } = require('./globalData.js');

app.use(cors());

app.use(express.json());

// User

async function createUser(data) {

  try {

    const user = await User.create({

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

// Thread

async function createThread(data) {

  try {

    const thread = await Thread.create({

      nama_fb: data.nama_fb,

      id_costum: data.id_costum,

      yen: data.yen,

      exp: data.exp,

      level: data.level

    });

    return thread;

  } catch (error) {

    console.error(error);

  }

}

async function getThread(id) {

  try {

    const thread = await Thread.findOne({ where: { id } });

    return thread;

  } catch (error) {

    console.error(error);

  }

}

async function updateThread(id, data) {

  try {

    const thread = await Thread.update(data, { where: { id } });

    return thread;

  } catch (error) {

    console.error(error);

  }

}

async function deleteThread(id) {

  try {

    const thread = await Thread.destroy({ where: { id } });

    return thread;

  } catch (error) {

    console.error(error);

  }

}

// Dashboard

async function getDashboard() {

  try {

    const dashboard = await Dashboard.findAll();

    return dashboard;

  } catch (error) {

    console.error(error);

  }

}

async function createDashboard(data) {

  try {

    const dashboard = await Dashboard.create(data);

    return dashboard;

  } catch (error) {

    console.error(error);

  }

}

// Global Data

async function getGlobalData() {

  try {

    const globalData = await GlobalData.findAll();

    return globalData;

  } catch (error) {

    console.error(error);

  }

}

async function createGlobalData(data) {

  try {

    const globalData = await GlobalData.create(data);

    return globalData;

  } catch (error) {

    console.error(error);

  }

}

// Routes

app.post('/createUser', createUser);

app.get('/getUser/:id', getUser);

app.put('/updateUser/:id', updateUser);

app.delete('/deleteUser/:id', deleteUser);

app.post('/createThread', createThread);

app.get('/getThread/:id', getThread);

app.put('/updateThread/:id', updateThread);

app.delete('/deleteThread/:id', deleteThread);

app.get('/getDashboard', getDashboard);

app.post('/createDashboard', createDashboard);

app.get('/getGlobalData', getGlobalData);

app.post('/createGlobalData', createGlobalData);

const port = process.env.PORT || 3000;

app.listen(port, () => {

  console.log(`Server running on port ${port}`);

});