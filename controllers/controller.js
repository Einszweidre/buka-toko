const {User}=require('../models')
const bcrypt=require('bcrypt')

class Controller{
    static showHome(req, res){ // jadiin tempat login sekalian kah ?
        res.render('home')
    }

    static loginPost(req, res){
        const {username,password}=req.body
        User.findOne({
            where:{
                username
            }
        })
            .then((user) => {
                if(user){
                    const compare=bcrypt.compareSync(password,user.password)
                    if(compare){
                        res.redirect('/') //buyer atau seler role
                    }
                } 
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
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