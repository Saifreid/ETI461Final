var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();

const uri = process.env.uri;



var app = express();

const port = 3000;

app.use(express.static('public'))


app.get('/getUsers', (req, res) => {
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
          const items = client.db("ETI461").collection("Users").find().toArray();
          res.json(items)
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
})



app.listen(port, () => {

    console.log(`App listening at http://localhost:${port}`);

})
