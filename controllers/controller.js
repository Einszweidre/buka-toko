const {User}=require('../models')
const bcrypt=require('bcrypt')

class Controller{
    static showHome(req, res){ // jadiin tempat login sekalian kah ?
        res.render('home')
    }

    static registerForm(req, res){
        res.render('register-form')
    }
    static registerPost(req, res){
        const {username,password,role}=req.body
        User.create({
            username,
            password,
            role
        })
        .then(()=>{
            res.redirect('/')
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
    }


}

module.exports = Controller