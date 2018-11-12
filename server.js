// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');   // call express
var app         = express();            // define our app using express
var bodyParser  = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fruits',{ useNewUrlParser: true }); // connect to our database
var Fruit     = require('./fruit');
var methodOverride = require('method-override');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT ||8080;    // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();          // get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Process executed.');
    next(); // make sure we go to the next routes and don't stop here
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    var viewall= "<br><form method='get' action='/api/fruits'><button type='submit'>View Stock</button></form>";
    var tester="<form method='post' action='/api/fruits'><br>Name:<br><input type='text' name='name' value='Fruit'><br>Price:<br><input type='number' name='price' value=1><br>Tax:<br><input type='number' name='tax' value=1><br><br><button type='submit'>Create New Inventory</button></form>";
    res.status(200);
    res.set('text/html').send("<title>SE3316 Lab 3</title><h1>Node.js Fruit Inventory API</h1>"+viewall+tester);
});


// on routes that end in /fruits
// ----------------------------------------------------------------------------


// create a fruit (accessed at POST http://localhost:8080/api/fruits)
router.post('/fruits', function(req, res) {
    var fruit = new Fruit();      // create a new instance of the Fruit model
    //alert(req.body);
    fruit.name = req.body.name;  // set the fruits name (comes from the request)
    fruit.quantity = 10;  
    fruit.price = req.body.price;  // set the fruits price (comes from the request)
    fruit.tax = req.body.tax;  // set the fruits tax (comes from the request)
    // save the fruit and check for errors
    fruit.save(function(err) {
        if (err)
            res.send(err);
        res.status(200);
        res.set('text/html').send("Stock created!<br><form method='get' action='/api'><button type='submit'>Back</button></form>");

    });
});
// get all the fruits (accessed at GET http://localhost:8080/api/fruits)
router.get('/fruits/', function(req, res) {
    Fruit.find(function(err, fruits) {
        if (err)
            res.send(err);
        var testing="";
        for(var i=0;i<fruits.length;i++){
            var temp="<a href='/api/fruits/"+fruits[i]._id+"'>"+fruits[i]+"</a><br>"
            testing=testing+temp;
        }
        testing=testing+"<br><br><form method='get' action='/api'><button type='submit'>Back</button></form>";
        res.status(200);
        res.set('text/html').send(testing);
    });
});

    
// on routes that end in /fruits/:fruit_id
// ----------------------------------------------------------------------------


// get the fruit with that id (accessed at GET http://localhost:8080/api/fruits/:fruit_id)
router.get('/fruits/:fruit_id', function(req, res) {
    Fruit.findById(req.params.fruit_id, function(err, fruit) {
        if (err)
            res.send(err);
        res.status(200);
        res.set('text/html').send("<form method='POST' action='/api/fruits/"+fruit._id+"?_method=PUT'><br>Name:<br><input type='text' name='name' value="+fruit.name+"><br>Quantity:<br><input type='number' name='quantity' value="+fruit.quantity+"><br>Tax:<br><input type='number' name='tax' value="+fruit.tax+"><br><br><button type='submit'>Update</button></form>"+
        "<form method='POST' action='/api/fruits/"+fruit._id+"?_method=DELETE'><button type='submit'>Delete</button></form>"+
        "<form method='get' action='/api/fruits'><button type='submit'>Back</button></form>");
    });
});
// update the fruit with this id (accessed at PUT http://localhost:8080/api/fruits/:fruit_id)
router.put('/fruits/:fruit_id', function(req, res) {
    // use our fruit model to find the fruit we want
    Fruit.findById(req.params.fruit_id, function(err, fruit) {
        if (err)
            res.send(err);
        fruit.name = req.body.name;  // update the fruits info
        fruit.quantity = req.body.quantity;  // update the fruits info
        fruit.tax = req.body.tax;  // update the fruits info
        fruit.save(function(err) {
            if (err)
                res.send(err);
            res.status(200);
            res.set('text/html').send("Fruit updated!<br><form method='get' action='/api/fruits'><button type='submit'>Back</button></form>");
        });
    });
});
// delete the fruit with this id (accessed at DELETE http://localhost:8080/api/fruits/:fruit_id)
router.delete('/fruits/:fruit_id', function(req, res) {
    Fruit.remove({
        _id: req.params.fruit_id
    }, function(err, fruit) {
        if (err)
            res.send(err);
        res.status(200);
        res.set('text/html').send("Successfully deleted.<br><form method='get' action='/api/fruits'><button type='submit'>Back</button></form>");
    });
});


// all of our routes will be prefixed with /api
// ----------------------------------------------------------------------------


app.use('/api', router);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('We are open for business on port ' + port);