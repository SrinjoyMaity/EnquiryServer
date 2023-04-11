var login = require ('./model/login.js');
var item = require('./model/item.js');
var ride = require('./model/ride.js');

const express=require('express');
const cors=require("cors");
const bcrypt=require('bcrypt');
const saltrounds=10;
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

// CORS //////
const whitelist=["http://localhost:3000"];
const corsoptions ={
    origin: function (origin, callback)
    {
        if(!origin || whitelist.indexOf(origin)!=-1){
            callback(null,true);
        }
        else{
            callback(new Error("Server access denied due to CORS!"))
        }
    },
    credentials: true
}
app.use(cors(corsoptions));
/// CORS ///////

//paths..........
const userRouter =express.Router();
app.use('/enquiry', userRouter);

userRouter
.route('/register')
.get()
.post(postAccount)

//GET functions /////////////////////////////////////////////////////////////

async function postAccount(req, res)
{
    res.statusCode=503;
    var rol, emal;
    await login.count({roll: req.body.roll}).then(function(data){
        rol=data;
    });
    
    await login.count({email:req.body.email}).then(function(data){
        emal=data;
    });
    
    if(rol||emal)
    {
        res.statusCode=406;
    }
    else
    {
        var pass="";
        await bcrypt.hash(req.body.password,saltrounds).then(function(data){
            pass=data;
            console.log(pass);
        });
        if(pass!=="")
        {
            var user= new login({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                roll:req.body.roll,
                email:req.body.email,
                birthdate:req.body.birthdate,
                password:pass
            });
            await user.save();
            console.log(user);
            await login.count({roll: req.body.roll}).then(function(data){
                rol=data;
            });
            if(rol)
            {
                res.statusCode=204;
            }
        }
    }
    res.send();
}

//POST functions ////////////////////////////////////////////////////////////

// PUT functions ////////////////////////////////////////////////////////////
// DELETE functions /////////////////////////////////////////////////////////
