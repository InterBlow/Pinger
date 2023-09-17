const express = require('express');
const userHelper = require('../helper/userHelper');

const route = express.Router();

route.get('/', async (req, res) => {
  if (req.session.adminName && req.session.email) {
    const data = await userHelper
      .showUsers()
      .then((data) => data)
      .catch((e) => console.error(err));

    const collection = await data.toArray();
    res.render('adminHome', { data: collection });
  } else {
    res.redirect('admin');
  }
});

module.exports = route;
