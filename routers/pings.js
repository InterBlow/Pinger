const express = require('express');
const userHelper = require('../helper/userHelper');

const route = express.Router();

route.get('/', async (req, res) => {
  if (req.session.email) {
    const data = await userHelper
      .showUserPings(req.session.email)
      .then((data) => data)
      .catch((e) => console.error(err));

    const collection = await data.toArray();
    res.render('pings', { data: collection });
  } else {
    res.redirect('login');
  }
});

//delete ping

route.get('/deletePing/:id', (req, res) => {
  let proId = req.params.id;
  userHelper.deletePing(proId).then((response) => {
    res.redirect('/');
  });
});

route.get('/createPing', (req, res) => {
  if (req.session.email) {
    //const message = req.session.message;
    req.session.message = '';
    res.render('pingCreate', { message: req.session.message });
  } else {
    res.redirect('/pings');
  }
});

route.post('/createPing', async (req, res) => {
  const currentPing = await userHelper
    .getPing(req.body.address)
    .then((data) => data.user);

  if (!currentPing) {
    const obj = {
      username: req.session.username,
      email: req.session.email,
      address: req.body.address,
      lastPinged: new Date(),
    };

    await userHelper.addPing(obj);

    res.redirect('/pings');
  } else {
    req.session.message = 'no duplicates allowed.';
    res.redirect('/pings');
  }
});

module.exports = route;
