var login = require ('./model/login.js');
var item = require('./model/item.js');
var ride = require('./model/ride.js');

const express=require('express');
const cors=require("cors");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
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
const whitelist=["http://localhost:3000","http://localhost:3000/main"];
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

userRouter
.route('/login')
.get()
.post(postCred)

userRouter
.route('/accdata')
.get(getAccount)
.post()

//GET functions /////////////////////////////////////////////////////////////
async function getAccount(req,res)
{
    var token = req.headers.authorization;
    res.statusCode=503;
    var allow = false;
    var avail = false;
    var decode;
    console.log("token:"+token);
    if(token)
    {
        try{
            decode = jwt.verify(token, 'lawra')
        }
         catch(err)
         {
            res.status(404).json({})
            return;
         };
         console.log("decode:"+decode.userId);
    }
    await login.count({_id: decode.userId}).then(function(data){
        if(data!==0)
        {
            avail=true;
        }
    });
    if(avail)
    {
        await login.findOne({_id: decode.userId},{password:false, email:false, verified:false, createddate:false})
        .then(async function(data){
            console.log(data);
            res.status(200).json(data);
        })
    }
    else
    {
        res.send();
    }

}

//POST functions ////////////////////////////////////////////////////////////
async function postCred(req,res)
{
    res.statusCode=503;
    var allow = false;
    var avail = false;
    await login.count({email: req.body.email}).then(function(data){
        if(data!==0)
        {
            avail=true;
        }
    });
    if(avail)
    {
        await login.findOne({email:req.body.email})
        .then(async function(data){
            if(!data.verified)
            {
                var pass;
                await bcrypt.compare(req.body.password,data.password).
                then(function(val){
                    pass=val;
                })
                if(pass)
                {
                    console.log(data);
                    const cookie=await jwt.sign({userId: data._id}, "lawra");
                    console.log(cookie);
                    res.status(200).json({
                        token:cookie,
                    });
                }
                else
                {
                    console.log("password didnot match");
                    res.statusCode=406;
                    res.send();
                }
            }
            else
            {
                console.log(req.body.email+"not verified");
                res.statusCode=406
                res.send();
            }
        })
    }
    else
    {
    res.send();
    }
}

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
                createddate: Date.now(),
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
// PUT functions ////////////////////////////////////////////////////////////
// DELETE functions /////////////////////////////////////////////////////////
