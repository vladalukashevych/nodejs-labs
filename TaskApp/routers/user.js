const express = require("express");
const userModel = require("../models/user");
const auth = require("../src/middleware/auth");
const taskModel = require("../models/task");
const router = new express.Router();

router.use(express.json());

router.get('/users', async (req, res) => {
    await userModel.find({}).then((users) => {
        res.status(200).send(users);
    }).catch((error) => {
        res.status(500).send();
    })
});

router.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    await userModel.findById(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.post('/users', async (req, res) => {
    const user = new userModel(req.body);
    let exst = await userModel.findByEmail(user.email);
    if (exst) {
        res.status(403).send({error: "Email already exists."});
        return;
    }
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(200).send({user, token});
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(403).send({error: error.message});
        } else {
            res.status(500).send({error: 'Server error'});
        }
    }
});
router.patch('/users/:id', async (req, res) => {
    const fields = ['password', 'name', 'age'];
    const user = await userModel.findById(req.params.id)
    if (!user) {
        res.status(500).send("User not found.");
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

router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).send('User not found.');
        } else {
            res.sendStatus(200);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/users', async (req, res) => {
    try {
        const deletedUsers = await userModel.deleteMany({owner: req.user});
        if (!deletedUsers)
            throw new Error();
        res.status(200).send({deletedUsers: deletedUsers, status: "Deleted"});
    } catch (error) {
        res.status(403).send("Users not found.");
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await userModel.findOneByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({message: "success", user, token});
    } catch (e) {
        res.status(400).send("Login error.");
    }
});

router.get("/users/me", auth, async (req, res) => {
    console.log(req);
    const user = req.user;
    try {
        await user.populate("tasks");
        res.status(200).send(user);
    } catch (e) {
        res.status(403).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token !== req.token;
        });
        await  req.user.save();
        res.status(200).send({message:"logout success"});
    }catch (e){
        res.status(500).send({message:e.message});
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        await userModel.updateMany({}, {$set: {tokens: []}});
        res.send("All logged out.");
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;


