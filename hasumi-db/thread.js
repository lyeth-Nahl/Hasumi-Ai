const axios = require('axios');
const BASE_URL = 'https://hasune-69d6d-default-rtdb.firebaseio.com/threads';

const addThread = async (threadID, adminID) => {
  try {
    const db = await axios.get(`${BASE_URL}.json`);
    if (!db.data[threadID]) {
      const newThread = { id: Object.keys(db.data).length + 1, admin: adminID, registered: true };
      await axios.put(`${BASE_URL}/${threadID}.json`, newThread);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Gagal menambahkan thread:', error.message);
    throw error;
  }
};

const unregistThread = async (threadID) => {
  try {
    const db = await axios.get(`${BASE_URL}.json`);
    if (db.data[threadID]) {
      await axios.put(`${BASE_URL}/${threadID}.json`, null);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Gagal menghapus thread:', error.message);
    throw error;
  }
};

const isThreadRegistered = async (threadID) => {
  try {
    const db = await axios.get(`${BASE_URL}.json`);
    return db.data[threadID] && db.data[threadID].registered === true;
  } catch (error) {
    console.error('Gagal mengecek status thread:', error.message);
    throw error;
  }
};

module.exports = { addThread, unregistThread, isThreadRegistered };