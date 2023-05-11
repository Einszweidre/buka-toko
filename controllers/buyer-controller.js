const { Product, Category,Profile,Transaction,ProductsTransaction,User } = require('../models')

class Controller {
    static buyerHome(req, res) {
        res.render('buyer')
    }

    static loginPost(req, res) {
        const { username, password } = req.body
        User.findOne({
            where: {
                username
            }
        })
            .then((user) => {
                if (user) {
                    const compare = bcrypt.compareSync(password, user.password)
                    if (compare) {
                        res.redirect('/') //buyer atau seler role
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static buyerDashboard(req, res) {
        let user
        User.findOne()
        .then(userFound=>{
            user=userFound
           return Category.findAll({
                include: Product,
            })
        })
        .then((Product)=>{
            res.render('buyer-dashboard', { Product,user })
        })
    }

    static buyerProfile(req, res) {
        Profile.findByPk('id?')
        .then(profile=>{
            res.render('buyer-profile',{profile})
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
    }

    static editProfile(req, res) {
        res.render('buyer-edit-profile')
    }

    static profilePost(req, res) {
        const {name,address,email,phoneNumber}=req.body
        Profile.create({
            name,
            address,
            email,
            phoneNumber,
            // UserId=id?
        })
        .then(_=>{
            res.redirect('/profile')
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
    }

    static checkout(req, res) {
        res.render('buyer-checkout')
    }

    static productDetail(req, res) {
        const {id}=req.params
        Product.findByPk(id)
        .then(product=>{
            res.render('product-detail')
        })
    }

    static cart(req, res) {
        res.render('buyer-cart')
    }

    static payment(req, res) {
        res.render('buyer-payment')
    }

    static paymentPost(req, res) {
        res.redirect('/transactions')
    }

    static transactions(req, res) {
        res.render('buyer-transactions')
    }
}


module.exports = Controller