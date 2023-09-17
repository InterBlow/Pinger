const express = require('express');
const userHelper = require('../helper/userHelper');
const bcrypt = require('bcrypt');
const db = require('../helper/userHelper');

const route = express.Router();

//admin

route.get('/', (req, res) => {
  if (req.session.adminName) {
    res.redirect('/adminHome');
  } else {
    const message = req.session.message;
    req.session.message = '';
    res.render('admin', { message: message, name: req.session.adminName });
  }
});

route.post('/', async (req, res) => {
  await db
    .adminLogin(req.body)
    .then((data) => {
      if (data.user) {
        req.session.adminName = data.username;
        req.session.email = data.email;
        res.redirect('adminHome');
      } else {
        req.session.message = 'user name or password is wrong';
        res.redirect('admin');
      }
    })
    .catch((e) => console.log(e));
});

route.get('/getUserPings/:email', async (req, res) => {
  if (req.session.adminName && req.session.email) {
    const data = await userHelper
      .showUserPings(req.params.email)
      .then((data) => data)
      .catch((e) => console.error(err));

    const collection = await data.toArray();
    res.render('pings', { data: collection });
  } else {
    res.redirect('/admin');
  }
});

//delete user
route.get('/deleteUser/:id', (req, res) => {
  let proId = req.params.id;
  if (!req.session.adminName || !req.session.email) {
    return res.redirect('/admin');
  }
  userHelper.deleteUser(proId).then((response) => {
    res.redirect('/adminHome');
  });
});

// edit user
route.get('/editUser/:id', async (req, res) => {
  if (!req.session.adminName || !req.session.email) {
    return res.redirect('/admin');
  }
  const user = await userHelper.getUserViaId(req.params.id);
  res.render('adminEdit', { user: user });
});

route.post('/editUser/admin/editUser/:id', async (req, res) => {
  if (!req.session.adminName || !req.session.email) {
    return res.redirect('/admin');
  }

  await userHelper.updateUser(req.body, req.params.id).then((response) => {
    res.redirect('/adminHome');
  });
});

//create user

route.get('/createUser', (req, res) => {
  if (!req.session.adminName || !req.session.email) {
    return res.redirect('/admin');
  }

  const message = req.session.message;
  req.session.message = '';
  res.render('adminCreate', { message: message });
});

route.post('/createUser', async (req, res) => {
  if (!req.session.adminName || !req.session.email) {
    return res.redirect('/admin');
  }

  const count = await userHelper.userCount(req.body).then((data) => data.user);

  if (!count) {
    const hashpass = await bcrypt.hash(req.body.password, 10);
    const obj = {
      username: req.body.username,
      email: req.body.email,
      password: hashpass,
    };

    userHelper.addUser(obj);

    res.redirect('/adminHome');
  } else {
    req.session.message = 'user already exist';
    res.redirect('/admin/createUser');
  }
});

module.exports = route;
