var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

var Content = require('../models/Content');
var User = require('../models/User');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const result = await Content.find({});
    return res.json(result);
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
router.delete('/:id', async function(req, res) {
  const result = await Content.remove({_id: mongoose.Types.ObjectId(req.params.id)});
  return res.json(result);
})

module.exports = router;
