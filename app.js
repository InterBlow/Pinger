const express = require('express');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const { connectToServer } = require('./conf/mongo.config');
const app = express();
const bodyParser = require('body-parser'); // Import body-parser
const PORT = process.env.PORT || 3000;

const routeIndex = require('./routers/index');
const routeLogin = require('./routers/login');
const routeLogout = require('./routers/logout');
const routeRegister = require('./routers/register');
const routeAdmin = require('./routers/admin');
const routeAdminHome = require('./routers/adminHome');
const routePings = require('./routers/pings');
const routeAuth = require('./routers/auth');

//server start here
connectToServer((err) => {
  if (err) console.log(err);
  else {
    console.log('Connected to mongoDB');

    try {
      const { sendGETRequestToAllPings } = require('./helper/sendPing');
      let busy = false;
      setInterval(async () => {
        if (!busy) {
          busy = true;
          try {
            await sendGETRequestToAllPings();
          } catch (error) {
            console.log(error);
            busy = false;
          }
          //console.log('sending requests...', busy);
          busy = false;
        } else {
          //console.log('cant, u r busy.');
        }
      }, 1_000);
    } catch (error) {
      console.log(error);
    }
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.text()); // configure the app to be able to read text
app.set('view engine', 'ejs');

//session
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);
/* app.use((req, res, next) => {
  if (!req.user) {
    res.header('cache-control', 'private,no-cache,no-store,must revalidate');
    res.header('Express', '-1');
    res.header('paragrm', 'no-cache');
  }
  next();
});
*/

//routes
app.use('/', routeIndex);
app.use('/login', routeLogin);
app.use('/logout', routeLogout);
app.use('/register', routeRegister);
app.use('/admin', routeAdmin);
app.use('/adminHome', routeAdminHome);
app.use('/pings', routePings);
app.use('/auth', routeAuth);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
