//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const encrypt =  require("mongoose-encryption");

const ejs = require("ejs");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

//////////////////////////////////////////////////////////////////

const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');


const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

////////////////////////////////////////////////////////////////

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    
    res.render("secrets");
        
    
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
        .then((foundUser)=>{
            if (foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else {
                    res.send("<h1>incorrect password!</h1>")
                }
            }
        })
            
        
    
})

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});