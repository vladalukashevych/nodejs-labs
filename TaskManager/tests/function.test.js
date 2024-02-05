

const server = require("../src/app.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const should = chai.should();
//require("../db/mongoose");


const UserModel = require("../models/user.js");
const TaskModel = require("../models/task.js");
const { response } = require("express");

chai.use(chaiHttp);

describe("Server requests", function() {  
    let task_Id;
    let token;
    before(async function() {
        this.timeout(5000);
        await UserModel.deleteMany({});
        await TaskModel.deleteMany({});
      });

  it("add user with errors",  function(done) {
    this.timeout(10000);
    chai.request(server)
    .post("/user/add")
    .send({        
        "name": "Ozzornin",
        "age": 14,
        "email": "y.ozornigmail.com",
        "password": "1233443215"
    })
    .end((err, res)=> {
        res.should.have.status(403);
        res.body.should.have.property('error');
        done();
    });
  });
  it("add user1 without errors",  function(done) {
    this.timeout(10000);
    chai.request(server)
    .post("/user/add")
    .send({        
        "name": "Ozzornin",
        "age": 20,
        "email": "y.ozornin@gmail.com",
        "password": "1233443215"
    })
    .end((err, res)=> {
        res.should.have.status(200);
        res.body.should.have.property("user");
        res.body.user.should.have.property("_id");
        done();
    });
  });
  it("add user2 without errors",  function(done) {
    this.timeout(10000);
    chai.request(server)
    .post("/user/add")
    .send({        
        "name": "Ozzornin2",
        "age": 24,
        "email": "ozornin@gmail.com",
        "password": "1233443215"
    })
    .end((err, res)=> {
        res.should.have.status(200);
        res.body.should.have.property("user");
        res.body.user.should.have.property("_id");
        done();
    });
  });
  it("user1 auth without errors", function(done){
    this.timeout(10000);   
    chai.request(server)
    .post('/users/login')
    .send(
        {
            "email": "y.ozornin@gmail.com",
            "password": "1233443215"
        })
    .end((err, res)=>{
        res.should.have.status(200);        
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        token = res.body.token;
        done()
        /*chai.request(server)
      .get('/users/me')      
      .auth(token, {type: 'bearer'})
      .end((err, res)=>{
          console.log(res.text);
          res.should.have.status(200);
          res.should.have.property("user");
          done();
      });*/
       
    });  

   
  });  
  
  it("add task1 without errors", function(done){
    this.timeout(10000);
    chai.request(server)
    .post('/task/add')
    .auth(token, {type: 'bearer'})
    .send(
        {
            "title": "Simple Task",
            "description": "Task1 for user1",
            "completed":false
        })
    .end((err, res)=>{
        res.should.have.status(200);
        res.body.should.have.property('task');
        res.body.task.should.have.property("_id");
        task_Id = res.body.task._id;        
        done();
    })
  })
  it("add task2 without errors", function(done){
    this.timeout(10000);
    chai.request(server)
    .post('/task/add')
    .auth(token, {type: 'bearer'})
    .send(
        {
            "title": "Simple Task2",
            "description": "Task2 for user1",
            "completed":false
        })
    .end((err, res)=>{
        res.should.have.status(200);
        res.body.should.have.property('task');
        res.body.task.should.have.property("_id"); 
        done();
    });
  });
  it("get two tasks of user1", function(done){
    this.timeout(10000);
    chai.request(server)
    .get('/tasks')
    .auth(token, {type: 'bearer'})    
    .end((err, res)=>{
        res.should.have.status(200);
        res.body.should.have.property('tasks');
        res.body.tasks.should.have.length(2); 
        done();
    });
  });
  it("get task1 by id", function(done){
    this.timeout(10000);
    chai.request(server)
    .get('/task/'+task_Id)
    .auth(token, {type: 'bearer'})    
    .end((err, res)=>{
        res.should.have.status(200);
        res.body.should.have.property('task');
        res.body.task.should.have.property('title'); 
        res.body.task.should.have.property('completed'); 
        done();
    });
  });
  it("logout user", function(done){
    this.timeout(10000);
    chai.request(server)
    .post('/users/logout')
    .auth(token, {type: 'bearer'})    
    .end((err, res)=>{
        res.should.have.status(200);
        res.text.should.equal("logout success")
        done();
    });
  });
  it("user2 auth without errors", function(done){
    this.timeout(10000);   
    chai.request(server)
    .post('/users/login')
    .send(
        {
            "email": "ozornin@gmail.com",
            "password": "1233443215"
        })
    .end((err, res)=>{
        res.should.have.status(200);        
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        token = res.body.token;
        done()  
    });  
  });  
  it("add task3 without errors", function(done){
    this.timeout(10000);
    chai.request(server)
    .post('/task/add')
    .auth(token, {type: 'bearer'})
    .send(
        {
            "title": "Simple Task3",
            "description": "Task3 for user2",
            "completed":false
        })
    .end((err, res)=>{
        res.should.have.status(200);
        res.body.should.have.property('task');
        res.body.task.should.have.property("_id");    
        done();
    })
  })
  it("get count of tasks of user2", function(done){
    this.timeout(10000);
    chai.request(server)
    .get('/tasks')
    .auth(token, {type: 'bearer'})    
    .end((err, res)=>{
        res.should.have.status(200);
        res.body.should.have.property('tasks');
        res.body.tasks.should.have.length(1); 
        done();
    });
  });
  it("get task1 by id", function(done){
    this.timeout(10000);
    chai.request(server)
    .get('/task/'+task_Id)
    .auth(token, {type: 'bearer'})    
    .end((err, res)=>{
      res.should.have.status(404);
      res.text.should.equal("Not Found")
        done();
    });
  });
  it("logout user", function(done){
    this.timeout(10000);
    chai.request(server)
    .post('/users/logout')
    .auth(token, {type: 'bearer'})    
    .end((err, res)=>{
        res.should.have.status(200);
        res.text.should.equal("logout success")
        done();
    });
  });
  it("get task1 by id", function(done){
    this.timeout(10000);
    chai.request(server)
    .get('/task/'+task_Id)
    .auth(token, {type: 'bearer'})    
    .end((err, res)=>{
      res.should.have.status(403);
      res.text.should.equal("Forbidden Access")
        done();
    });
  });
});

