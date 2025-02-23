const axios = require('axios');
const BASE_URL = 'https://hasune-69d6d-default-rtdb.firebaseio.com/users';

const getData = async (userID) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userID}.json`);
    return response.data;
  } catch (error) {
    console.error('Gagal mendapatkan data user:', error.message);
    throw error;
  }
};

const setData = async (userID, data) => {
  try {
    await axios.put(`${BASE_URL}/${userID}.json`, data);
    return { success: true, message: 'Data user berhasil disimpan.' };
  } catch (error) {
    console.error('Gagal menyimpan data user:', error.message);
    throw error;
  }
};

const createUser = async (userID) => {
  try {
    const userData = {
      nama: "Unknown",
      yen: 0,
      exp: 0,
      level: 1,
      daily: null,
      id: userID,
      banned: false
    };
    await setData(userID, userData);
    return { success: true, message: 'User berhasil dibuat.' };
  } catch (error) {
    console.error('Gagal membuat user:', error.message);
    throw error;
  }
};

const banUser = async (userID) => {
  try {
    const userData = await getData(userID);
    if (userData) {
      userData.banned = true;
      await setData(userID, userData);
      return { success: true, message: 'User berhasil dibanned.' };
    } else {
      return { success: false, message: 'User tidak ditemukan.' };
    }
  } catch (error) {
    console.error('Gagal membanned user:', error.message);
    throw error;
  }
};

const unbanUser = async (userID) => {
  try {
    const userData = await getData(userID);
    if (userData) {
      userData.banned = false;
      await setData(userID, userData);
      return { success: true, message: 'User berhasil diunbanned.' };
    } else {
      return { success: false, message: 'User tidak ditemukan.' };
    }
  } catch (error) {
    console.error('Gagal mengunbanned user:', error.message);
    throw error;
  }
};

module.exports = { getData, setData, createUser, banUser, unbanUser }