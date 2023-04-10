var login = require ('./model/login.js');
var item = require('./model/item.js');
var ride = require('./model/ride.js');
const express=require('express');
const app=express();

app.use(express.json());

// Connecting to the mongo database.................

const mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/enquiry');
console.log('DataBase Connected:');

const userscm= new mongoose.Schema({});
const collect= mongoose.model('Author', userscm, 'author');

var dat=collect.find({},{ _id:0 }).then(function(data){
    console.log(data);
});

// Mongo database Connected...............

app.listen(2000);

//paths..........


//GET functions /////////////////////////////////////////////////////////////

app.get('/', (req, res)=>
{
    res.send('<h1>Hello world</h1>')
});

//POST functions ////////////////////////////////////////////////////////////

// PUT functions ////////////////////////////////////////////////////////////
// DELETE functions /////////////////////////////////////////////////////////