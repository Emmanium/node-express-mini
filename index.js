// implement your API here
//"import express", package requre
const express = require('express');

//file require
const db = require('./data/db');

//server is an object
const server = express();

//port is usually assigned a constant
const PORT = 4000;

//middleware
const parser = express.json();
server.use(parser);

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

server.post('/api/users', (req, res) => {
  //body lives on req, request is everything that comes in, response is everything that goes out
  const user = req.body;
  console.log('user from body', user);
  if (user.name && user.bio) {
    db.insert(user)
    .then(idInfo => {
      res.status(201) //201 means something has been created
      .json(idInfo); //object with id is added
    })
    .catch(err => {
      res.status(500) //500 = something went wrong maybe you or us
        .json({message: "failed insert user in db"})
    });
  } else {
    res.status(400).json({ message: "missing name or bio"}) //status 400 is the client messed up
  }
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id) // remove returns count of records deleted
    .then(count=> {
      if (count) {
        // something has been deleted
        // send back the user
        // below isn't ideal since we would like to send back the user
        res.json({ message: "successfully deleted" })
      } else {
        res.status(404)
          .json({ message: "invalid id" })
      }
    })
    .catch(err => {
      res.status(500)
        .status({ message: "failed to delete user" })
    });
});

server.put('/api/users/:id', (req, res) => {
  const user = req.body
  const { id } = req.params
  if (user.name && user.bio) {
    db.update(id, user).then(count => {
      if (count) {
        // 200 successfully updated (send back our updated user)
        db.findById(id).then(user => {
          res.json(user);
        })
      } else {
        // 404 invalid id
        res.status(404)
          .json({ message: 'invalid id' })
      }
    })
    .catch(err => {
      // 500 something else went wrong
      res.status(500)
        .json({ message: "failed to update user" })
    })
  } else {
    //400 name or bio is missing
    res.status(400)
      .json({ message: "missing name or bio "})
  }
})

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
