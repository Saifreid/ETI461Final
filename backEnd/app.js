var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
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
app.use(cookieParser());

app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true
}));



const uri = process.env.uri;

function isEqual(item1, item2){
    if (JSON.stringify(item1) == JSON.stringify(item2)){
        return true;
    }else{
        return false;
    }
}

function getJsonIndex(cartList, target){
    for(let i = 0; i < cartList.length; i++){
        if(isEqual(cartList[i], target)){
            return i
        }
    }
    return -1
}

//Basic function that gets the list of users not used in the project.
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

//Basic add user the one used for project is /registerUser

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


//Verifies the username and password login credentials on signIn.html
app.post('/checkLogin', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', "*");

    const bcrypt = require('bcrypt');
    const uri = process.env.uri;
    const session = require('express-session');
    app.use(session({
        secret: process.env.session_secret,
        resave: false,
        saveUninitialized: true
    }));
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const user = {username: req.body.username};

    try {
        await client.connect();
        await client.db("ETI461").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const result = await client.db("ETI461").collection("Users").findOne(user);
        
        if (result) {
            const passwordMatch = await bcrypt.compare(req.body.password, result.password);
            if (passwordMatch) {
                console.log(result.username);
                req.session.user = result.username;
                console.log("Session SET");

                // res.cookie("user", result.username, { maxAge: 1000 * 60 * 60 * 24 });
                // res.cookie("pass", result.password, { maxAge: 1000 * 60 * 60 * 24 });
                res.json([true, "user=" + result.username + "&pass=" + result.password]);
            } else {
                res.json([false]);
            }
        } else {
            res.json([false]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
});


//Adds a new entry to the database with a new username, password, and an empty cart
app.post('/registerUser', async function(req, res) {
    const {MongoClient, ServerApiVersion} = require('mongodb');
    const uri = process.env.uri;
    const bcrypt = require('bcrypt');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    
    async function run(){
        
        try{
            var user = req.body.username;
            var pass = req.body.password;
            
            console.log(req.body);
            console.log("Before run()");
            await client.connect();
            await client.db("ETI461").command({ping: 1});
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const existingUser = await client.db("ETI461").collection("Users").findOne({ username: user });
            if (existingUser){
                res.json({success: false, message: "Username already exists"});
            } else{
                const hashedPassword = await bcrypt.hash(pass, 10);
                const item = { username: user, password: hashedPassword, cart: [] };
                const insertionResult = await client.db("ETI461").collection("Users").insertOne(item);
                res.json({ success: true, message: "User registered successfully" });
            }
        } catch(err){
            console.error(err);
            res.status(500).json({ success: false, message: "An error occurred while registering the user" });
        }  
        finally{
            await client.close();
        }
    }
    run().catch(console.dir);
})


//Retrieves the list of games from the database
app.get('/getGames', (req, res) => {
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
          const items = await client.db("ETI461").collection("Games").find().toArray();
          res.json(items);
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
})

app.post('/addToCart', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const session = require('express-session');
    app.use(session({
        secret: process.env.session_secret,
        resave: false,
        saveUninitialized: true
    }));
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
          user = req.session.user;
          console.log(user);
          const items = await client.db("ETI461").collection("Users").findOne({username: "admin"}); //hard coded for now edit this later
          let mycart = items.cart;
          mycart.push(req.body);
          const items2 = await client.db("ETI461").collection("Users").updateOne({username: "admin"}, {$set: {cart: mycart}} ) //hard coded for now edit this later
          res.json(items);


        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
})


app.post('/removeFromCart', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const session = require('express-session');
    app.use(session({
        secret: process.env.session_secret,
        resave: false,
        saveUninitialized: true
    }));
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
          user = req.session.user;
          console.log(user);
          const items = await client.db("ETI461").collection("Users").findOne({username: "admin"}); //hard coded for now edit this later
          let mycart = items.cart;
          console.log(mycart);
          console.log("this is req body");
          console.log(req.body);
          itemIndex = getJsonIndex(mycart ,req.body);
          console.log(itemIndex);
          mycart.splice(itemIndex, 1);
          const items2 = await client.db("ETI461").collection("Users").updateOne({username: "admin"}, {$set: {cart: mycart}} ) //hard coded for now edit this later
          res.json(items);


        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
})
 
app.get('/getCart', (req, res) => {
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
          const items = await client.db("ETI461").collection("Users").findOne({username: "admin"});//hard coded change later
          res.json(items.cart);
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
})

app.post('/clearCart', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const session = require('express-session');
    app.use(session({
        secret: process.env.session_secret,
        resave: false,
        saveUninitialized: true
    }));
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
          user = req.session.user;
          console.log(user);
          const items = await client.db("ETI461").collection("Users").findOne({username: "admin"}); //hard coded for now edit this later
          let mycart = [];
          const items2 = await client.db("ETI461").collection("Users").updateOne({username: "admin"}, {$set: {cart: mycart}} ) //hard coded for now edit this later
          res.json(items);


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