//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 17;

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

//////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");


mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');


const userSchema = new mongoose.Schema({
    email : String,
    password : String
});



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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.

        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save()
        
        res.render("secrets");
        
    
    });

});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
        .then((foundUser)=>{
            if (foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result){
                        res.render("secrets");
                    }else{
                        res.send("<h1>incorrect password!</h1>")
                    }
                });
                
            }
        })
            
        
    
})

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});