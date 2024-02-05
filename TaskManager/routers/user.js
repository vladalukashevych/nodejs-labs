const express = require("express");
const UserModel = require("../models/user");
const auth = require("../src/middleware/auth");
const router = new express.Router();

router.use(express.json());

router.get('/users', async (req, res) => { 
  console.log(200);
  await UserModel.find({}).then((users) => {
    
    res.status(200).send(users);
    
  }).catch((error) => {
    console.log(error);
    res.status(500).send();
  })
});
router.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  await UserModel.findById(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post('/user/add', async (req, res) => {
  const user = new UserModel(req.body);    
  let exst = await UserModel.findByEmail(user.email);
  if(exst)
  {
    res.status(403).send({error:"This email is exist"});
    return;
  }
  try {
    const token = await user.generateAuthToken();
    await user.save();    
    res.status(200).send({ user, token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(403).send({ error: error.message});
    } else {
      res.status(500).send({ error: 'Server error'});
    }
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).send('User not found');
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.patch('/users/:id', async (req, res) => {
  const fields = ['password', 'name', 'age'];
  const user = await UserModel.findById(req.params.id)
  if (!user) {
    res.status(500).send("User not found");
    return;
  }
  fields.forEach((field) => {
    if (req.body[field]) {
      user[field] = req.body[field];
    }
  })
  user.save()
    .then((saved) => {
      res.status(200).send(saved);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
})

router.post('/users/login', async (req, res) => { 
  try {
    const user = await UserModel.findOneByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({user, token});
  } catch (e) {
    console.log(e);
    res.status(400).send("User login error");
  }
})

router.get("/users/me", auth, async(req, res)=>{
  const user = req.user;
  try{
    await user.populate("tasks");    
    res.status(200).send(user);
  }
  catch(e)
  {
    res.status(403).send(e);
  }  
})

router.post('/users/logout', auth, async(req,res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token != req.token;
    })
    await req.user.save();
    res.status(200).send('logout success');
  } catch (e){
    res.status(500).send();
  }  
})
router.post('/users/logoutAll', auth, async(req,res)=>{
  try{
    await UserModel.updateMany({}, {$set: {tokens: []}});
    res.send("Done");
  }
  catch (e)
  {
    res.status(500).send();
  }
})
module.exports = router;


