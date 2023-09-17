const db = require('../conf/mongo.config');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

module.exports = {
  addUser: (obj) => {
    return new Promise(async (resolve, rej) => {
      const res = await db.getDb().collection('users').insertOne(obj);
      let response = {};
      if (res) {
        response.status = true;
        resolve(response);
      } else {
        response.status = false;
        resolve(response);
      }
    }).catch((e) => console.log(err));
  },
  doLogin: (body) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .getDb()
        .collection('users')
        .findOne({ email: body.email });
      if (user) {
        await bcrypt
          .compare(body.password, user.password)
          .then((data) => {
            response.user = data;
            response.username = user.username;
            response.status = true;
            resolve(response);
          })
          .catch((e) => console.log(e));
      } else {
        response.user = false;
        response.status = false;
        resolve(response);
      }
    });
  },
  doDiscordLogin: (body) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .getDb()
        .collection('users')
        .findOne({ email: body.email });
      if (user) {
        response.user = body;
        response.username = user.username;
        response.status = true;
        resolve(response);
      } else {
        response.user = false;
        response.status = false;
        resolve(response);
      }
    });
  },
  adminLogin: (body) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .getDb()
        .collection('admin')
        .findOne({ email: body.email });
      if (user) {
        await bcrypt.compare(body.password, user.password).then((data) => {
          response.user = data;
          response.username = user.username;
          response.email = user.email;
          response.status = true;
          resolve(response);
        });
      } else {
        response.user = false;
        response.status = false;
        resolve(response);
      }
    });
  },
  userCount: (body) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .getDb()
        .collection('users')
        .findOne({ email: body.email });
      if (user) {
        response.user = true;
        response.status = true;
        resolve(response);
      } else {
        response.user = false;
        response.status = false;
        resolve(response);
      }
    }).catch((e) => console.log(e));
  },
  showUsers: () => {
    return new Promise(async (resolve, reject) => {
      const data = await db.getDb().collection('users').find();
      if (data) {
        resolve(data);
      } else {
        reject('data not found');
      }
    });
  },
  showUserPings: (email) => {
    return new Promise(async (resolve, reject) => {
      const data = await db.getDb().collection('pings').find({ email: email });
      if (data) {
        resolve(data);
      } else {
        reject('data not found');
      }
    });
  },
  showAllPingsFromAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      const data = await db.getDb().collection('pings').find();
      if (data) {
        resolve(data.toArray());
      } else {
        reject('data not found');
      }
    });
  },
  deleteUser: (id) => {
    return new Promise(async (resolve, reject) => {
      const data = await db
        .getDb()
        .collection('users')
        .deleteOne({ _id: ObjectId(id) });
      if (data) {
        resolve(data);
      } else {
        reject('data not found');
      }
    });
  },
  getPing: (body) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let ping = await db
        .getDb()
        .collection('pings')
        .findOne({ email: body.email });
      if (ping) {
        response.user = true;
        response.status = true;
        resolve(response);
      } else {
        response.user = false;
        response.status = false;
        resolve(response);
      }
    }).catch((e) => console.log(e));
  },
  addPing: (obj) => {
    return new Promise(async (resolve, rej) => {
      const res = await db.getDb().collection('pings').insertOne(obj);
      let response = {};
      if (res) {
        response.status = true;
        resolve(response);
      } else {
        response.status = false;
        resolve(response);
      }
    }).catch((e) => console.log(err));
  },
  deletePing: (id) => {
    return new Promise(async (resolve, reject) => {
      const data = await db
        .getDb()
        .collection('pings')
        .deleteOne({ _id: ObjectId(id) });
      if (data) {
        resolve(data);
      } else {
        reject('data not found');
      }
    });
  },
  getUserViaEmail: (email) => {
    return new Promise(async (resolve, reject) => {
      const data = await db
        .getDb()
        .collection('users')
        .findOne({ email: email });
      if (data) {
        resolve(data);
      } else {
        reject('data not found');
      }
    });
  },
  getUserViaId: (id) => {
    return new Promise(async (resolve, reject) => {
      const data = await db
        .getDb()
        .collection('users')
        .findOne({ _id: ObjectId(id) });
      if (data) {
        resolve(data);
      } else {
        reject('data not found');
      }
    });
  },
  updateUser: (body, id) => {
    return new Promise(async (resolve, reject) => {
      const hashpass = await bcrypt.hash(body.password, 10);
      const data = await db
        .getDb()
        .collection('users')
        .updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              username: body.username,
              email: body.email,
              password: hashpass,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  updatePingWithCurrentTime: (id) => {
    return new Promise(async (resolve, reject) => {
      const data = await db
        .getDb()
        .collection('pings')
        .updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              lastPinged: new Date(),
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  updatePingWithStatus: (id, statusText, status) => {
    return new Promise(async (resolve, reject) => {
      const data = await db
        .getDb()
        .collection('pings')
        .updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              statusText: statusText,
              status: status,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
};
