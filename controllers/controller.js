const {User}=require('../models')
const bcrypt=require('bcrypt')

class Controller{
    static showHome(req, res){ // jadiin tempat login sekalian kah ?
        res.render('home')
    }

    static registerForm(req, res){
        const { error } = req.query
        res.render('register-form',{error})
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
            if (err.name === 'SequelizeValidationError') {
                const errors = err.errors.map((el) => el.message)
                res.redirect(`/register?error=${errors}`)
            } else {
                console.log(err);
                res.send(err)
            }
        })
    }


}

module.exports = Controller