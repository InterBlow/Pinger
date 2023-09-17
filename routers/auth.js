const express = require('express');
const route = express.Router();
const db = require('../helper/userHelper');
route.get('/discord', async (request, response) => {
  if (request.query.email) {
    let user;
    try {
      user = await db.getUserViaEmail(request.query.email);
    } catch (error) {
      console.log(error);
    }

    if (user) {
      await db.doDiscordLogin(request.query);
      request.session.message = 'log in success';
      request.session.email = request.query.email;
      request.session.username = request.query.username;
      response.redirect('/pings');
    } else {
      await db.addUser(request.query);
      let status = await db.doDiscordLogin(request.query);
      if (status.status) {
        request.session.message = 'log in success';
        request.session.email = request.query.email;
        request.session.username = request.query.username;
        response.redirect('/pings');
      } else {
        response.redirect('/login');
      }
    }
  } else {
    return response.sendFile('loginViaDiscord.html', { root: 'public' });
  }
});

module.exports = route;
