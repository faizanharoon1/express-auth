var express = require('express'),
    app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('keyboard catspy'));
app.use(express.session());

var users = {
  "catspy": "steps",
  "milo": "man"
};

var authenticate = function(req, res, next) {
  console.log('authenticating');
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.get('/', authenticate, function(req, res) {
  res.send('Hello there ' + req.session.user + '. <a href="/logout">Logout</a>');
});

app.get('/login', function(req, res) {
  if (req.session.user)
    res.redirect('/');

  var errMsg = req.session.loginError ? '<i>' + req.session.loginError + '</i><br />' : '';
  var html = '<!DOCTYPE html>' +
             '<html>' +
             '<body>' +
             errMsg +
             '<form action="/login" method="POST">' +
             '<input type="text" name="username" placeholder="Username" /><br />' +
             '<input type="password" name="password" placeholder="Password" /><br />' +
             '<input type="submit" value="Login" />' +
             '</form>' +
             '</body>' +
             '<html>';
  res.send(html);
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var userPass = users[username];
  if (userPass && userPass === req.body.password) {
    req.session.loginError = null;
    req.session.user = username;
    res.redirect('/');
  } else {
    req.session.loginError = 'Wrong username or password.';
    res.redirect('/login');
  }
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/hey', authenticate, function(req, res) {
  res.send('Hello ' + req.session.user + '. This is another secured page.');
});

app.listen(3000);
console.log('Listening on port 3000');