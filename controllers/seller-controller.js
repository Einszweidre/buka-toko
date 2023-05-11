const { Product, Category,Profile,Transaction,ProductsTransaction,User } = require('../models')
const bcrypt = require('bcrypt')

class Controller{
    static sellerHome(req, res){
        const {error} = req.query
        res.render('seller', {error})
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

                        req.session.userId = user.id
                        req.session.role = user.role
                        return res.redirect('/seller/dashboard') //buyer atau seller role
                    } else{
                        const error = "invalid password"
                        return res.redirect(`/seller?error=${error}`)
                    }
                } else{
                    const error = "username not found"
                    return res.redirect(`/seller?error=${error}`)
                }
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static sellerDashboard(req,res){
        res.render('seller-dashboard')
    }

    static logout(req,res){
        req.session.destroy((err) => {
            if(err){
                res.send(err)
            } else{
                res.redirect('/')
            }
        })
    }

}

module.exports = Controller