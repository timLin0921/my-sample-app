const fs = require('fs');
const cors = require('cors');
const path = require('path');
const https = require('https');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const config = require('./config/config');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const authenticatedRoutes = require('./routes/authenticated');
const errorController = require('./controllers/error');
const swaggerRoutes = require('./routes/swagger');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const {NODE_ENV, DB_HOST, DB_PORT, DB_NAME, PORT, SESSION_SECRET} = config;
const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');
const dbPath = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Register ExpressHandlebars instance-level helpers
const hbs = exphbs.create({
  defaultLayout: 'layout',
  partialsDir: ['views/partials/'],
});
// define handlebars using
app.engine('handlebars', hbs.engine);
// tell express that all templates ahead will be handlebars
app.set('view engine', 'handlebars');

mongoose.connect(dbPath, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.log(`db has error: ${error}`);
});

// connect successfully
db.once('open', () => {
  console.log('mongodb connected!');
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbPath,
    }),
    cookie: {maxAge: 60 * 60 * 1000},
  }),
);

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('_method'));

// use passport for register/login (includ oauth2)
app.use(passport.initialize());
app.use(passport.session());

// use flash message
app.use(flash({sessionKeyName: 'flashMessage'}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();

  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.fail_msg = req.flash('fail_msg');
  next();
});

// use route
app.use('/', authenticatedRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/swagger', swaggerRoutes);

// 404 error page
app.use(errorController);

if (NODE_ENV === 'production') {
  app.listen(PORT, () => {
    console.log(`Express is listening on https://localhost:${PORT}`);
  });
} else {
  const server = https.createServer({key: key, cert: cert}, app);

  server.listen(PORT, () => {
    console.log(`Express is listening on https://localhost:${PORT}`);
  });
}
