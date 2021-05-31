var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const multer = require('multer');
const path = require('path');
var Content = require('../models/Content');
var User = require('../models/User');


/* GET home page. */
router.get('/', async function(req, res, next) {
    const result = await Content.find({});
    console.log(result);
    res.set('Access-Control-Allow-Origin', '*')
    return res.json(result);
});

router.post('/test', async (req, res) => {
  let count = 0;
  console.log(req.body);
  req.body.tests.map((item, index) => {
    if(item.good == req.body.answer[index]) {
      count++;
    } 
  })
  console.log(count);
  res.json(count);
  
})

router.post('/content', async (req, res) => {
  console.log(req.body);  
  if(req.body.type == 'Тест') {
    const content = Content({
      title: req.body.title,
      desc: req.body.desc,
      category: req.body.category,
      type: req.body.type,
      imgSrc: req.body.img,
      name: req.body.name,
      tests: JSON.parse(req.body.tests)
    });
    content.save(err => {
      console.log(err);
    });
  } 
  
  return res.send('');
});

router.post('/auth/login', async (req, res) => {
  let login = req.body.login;
  let pass = req.body.pass;

  const result = await User.find({login: login, pass: pass});
  
  console.log(result);

  if (result.length === 0) {
    req.session.login = false;
    return res.json(req.session.login);
  }

  return res.json(result);
});
router.get('/auth/login', (req, res) => {
  res.json(req.session.login);
});

router.post('/auth/reg', async (req, res) => {
  let surname = req.body.surname;
  let name = req.body.name;
  let middleName= req.body.middleName;
  let login = req.body.login;
  let pass = req.body.pass;

  const users = await User.find({});
  console.log(users);
  const isHave = users.find(item => (item.login == login) > 0);
  console.log(isHave);
  if (isHave){
    return res.send(false);
  }  

  const user = new User({
    surname: surname,
    name: name,
    middleName: middleName,
    login: login,
    pass: pass,
    role: 'Клиент'
  })
  user.save();
  return res.send(true);
});

router.get('/lectures', async function(req, res) {
    const result = await Content.find({type: 'Лекция'});
    return res.json(result);
});
router.get('/practice', async function(req, res) {
  const result = await Content.find({type: 'Практическая'});
  return res.json(result);
});
router.get('/controls', async function(req, res) {
  const result = await Content.find({type: 'Контрольная'});
  return res.json(result);
});
router.get('/tests', async function(req, res) {
  const result = await Content.find({type: 'Тест'});
  return res.json(result);
});
router.post('/', async function(req, res) {
  const count = await Content.find({type: req.body.type}); 
  const objecter = new Content({
    title: req.body.type + ` ${count.length + 1} : ` + req.body.title,
    desc: req.body.desc,
    category: req.body.category,
    url: req.body.url,
    type: req.body.type,
    tests: req.body.tests,
    imgSrc: req.body.imgSrc
  });
  objecter.save();
  return res.json(objecter);
})
router.get('/del/:id', async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  const result = await Content.remove({_id: mongoose.Types.ObjectId(req.params.id)});
  
  return res.json(result);
})

module.exports = router;
