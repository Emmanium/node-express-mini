// implement your API here
//"import express", package requre
const express = require('express');

//file require
const db = require('./data/db');

//server is an object
const server = express();

//port is usually assigned a constant
const PORT = 4000;

//endpoints
server.get('/api/users', (req, res) => {
  //we use find to get our masterlist of users, returns a promise, so use .then and .catch
  db.find()
    .then((users) => {
      res.json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Failed to get users" })
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      //if statement in the case that the user comes back undefined (going to an id that doesn't exist)
      if (user) {
        res.json(user);
      } else {
        res.status(404)
          .json({ message: 'User undefined'})
      }
    })
    .catch(err => {
      res.status(500)
        .json({ message: "Failed to get user" })
    })
});

//express method get
/* server.get('/greet', (req, res) => {
  //res send can send strings, objects
  //res.send({message: 'request received'});
  res.send('Hello there!')
  //res.json sends objects, stringify's for us
  //if you want to change status you can use res.status(200)
  //res.json({ message: 'hey' })
}); */

/* server.get('/greet/:name', (req, res) => {
  //req has an object called params attached to it
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
}); */

//last thing you need is to get the server to listen (first param is the port number, second param is a callback function (error))
//make sure it's at the bottom!
server.listen(PORT, () => {
  console.log(`server is up and running on port ${PORT}`);
});
