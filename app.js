var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const multer = require('multer');
var indexRouter = require('./routes/index');
var Content = require('./models/Content');
var app = express();
app.use(multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
      
        cb(null, './public/doc/');
    },
  
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
      let {title, desc, category, type, img} = req.body;
 
  
  let filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
  
      const content = new Content({
        title: title,
        desc: desc,
        category: category,
        type: type,
        url: filename,
        imgSrc: img 
      });
      console.log('----');
      content.save(err => {
        console.log(err);
      });
      console.log(content);
      console.log('----');
        cb(null, filename);
    }
  })}).single('file'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(session({secret: 'tsss', resave: false, saveUninitialized: false}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/')));

app.use('/', indexRouter);

module.exports = app;
