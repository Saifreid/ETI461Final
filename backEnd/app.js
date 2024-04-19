var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
var bodyParser = require('body-parser');


var app = express();

const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



const uri = process.env.uri;


app.get('/getUsers', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

      async function run() {
        try {
          // Connect the client to the server	(optional starting in v4.7)
          await client.connect();
          // Send a ping to confirm a successful connection
          await client.db("ETI461").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
          const items = await client.db("ETI461").collection("Users").find().toArray();
          res.json(items);
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
})


app.post('/addUser', async function(req, res) {
    const {MongoClient, ServerApiVersion} = require('mongodb');
    const uri = process.env.uri;
    res.setHeader('Access-Control-Allow-Origin', '*');
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const item = {username: req.body.username, password: req.body.password, cart: []};
    console.log(req.body);
    console.log(item);
    async function run(){
        try{
            await client.connect();
            await client.db("ETI461").command({ping: 1});
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const result = await client.db("ETI461").collection("Users").insertOne(item);
            res.json(result);
        }   finally{
            await client.close();
        }
    }
    run().catch(console.dir);
})



app.listen(port, () => {

    console.log(`App listening at http://localhost:${port}`);

})
