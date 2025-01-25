class UsersData {

  constructor() {

    this.users = [];

  }

  async getUser(id) {

    return new Promise((resolve, reject) => {

      const user = this.users.find((user) => user.id === id);

      if (user) {

        resolve(user);

      } else {

        reject(new Error(`User dengan ID ${id} tidak ditemukan`));

      }

    });

  }

  async getUsers() {

    return new Promise((resolve, reject) => {

      resolve(this.users);

    });

  }

  async addUser(data) {

    return new Promise((resolve, reject) => {

      const user = {

        id: data.id,

        name: data.name,

        money: 0,

        exp: 0,

        level: 0,

        costumId: data.costumId,

      };

      this.users.push(user);

      resolve();

    });

  }

  async updateUser(data) {

    return new Promise((resolve, reject) => {

      const userIndex = this.users.findIndex((user) => user.id === data.id);

      if (userIndex !== -1) {

        this.users[userIndex] = {

          id: data.id,

          name: data.name,

          money: data.money,

          exp: data.exp,

          level: data.level,

          costumId: data.costumId,

        };

        resolve();

      } else {

        reject(new Error(`User dengan ID ${data.id} tidak ditemukan`));

      }

    });

  }

  async deleteUser(id) {

    return new Promise((resolve, reject) => {

      const userIndex = this.users.findIndex((user) => user.id === id);

      if (userIndex !== -1) {

        this.users.splice(userIndex, 1);

        resolve();

      } else {

        reject(new Error(`User dengan ID ${id} tidak ditemukan`));

      }

    });

  }

  async tambahYen(id, jumlahYen) {

    const user = await this.getUser(id);

    if (user) {

      user.money += jumlahYen;

      await this.updateUser(user);

    }

  }

  async handleChat(id, pesan) {

    await this.tambahYen(id, 0.5);

    console.log(`Pesan dari ${id}: ${pesan}`);

  }

}

module.exports = UsersData;