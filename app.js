var express = require('express'),
    app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('keyboard catspy'));
app.use(express.session());

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
  var html = '<!DOCTYPE html>' +
             '<html>' +
             '<body>' +
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
  console.log('Username = ' + req.body.username);
  var username = 'catspy';
  //if (username === req.body.username) {
    req.session.user = 'catspy';
    res.redirect('/');
  //} else {
    //console.log('Not equal!');
    //res.redirect('/login');
  //}
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000);
console.log('Listening on port 3000');