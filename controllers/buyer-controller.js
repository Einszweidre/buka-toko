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
                        return Profile.findOne({
                            where:{
                                UserId:user.id
                            }
                        })
                    } else {

                    }
                }
            })
            .then(profile=>{
                if(!profile){
                    res.redirect('/profile/add')
                } else {
                    res.redirect('/dashboard')
                }
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static addProfile(req, res) {
        User.findByPk(id)
        .then(user=>{
            res.render('add-profile',{user})
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
    }

    static addProfilePost(req, res) {
        const {UserId,name,address,email,phoneNumber}=req.body
        Profile.create({
            name,
            address,
            email,
            phoneNumber,
            UserId
        })
        .then(_=>{
            res.redirect('/dashboard')
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
    }

    static buyerDashboard(req, res) {
        let user
        let categories
        User.findByPk(id)
        .then(userFound=>{
            user=userFound
           return Category.findAll()
        })
        .then((categoriesList)=>{
            categories=categoriesList
            let option={}
            if (req.query.CategoryId) {
                const { CategoryId } = req.query
                option.where = {
                    CategoryId
                }
            }
            console.log(option);
            return Product.findAll(option)
        })
        .then((products)=>{
            res.render('buyer-dashboard', { products,categories,user })
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
    }

    static editProfile(req, res) {
        Profile.findByPk(id)
        .then(profile=>{
            res.render('buyer-edit-profile',{profile})
        })
        .catch(err=>{
           res.send(err)
           console.log(err); 
        })  
    }

    static editProfilePost(req, res) {
        const {name,address,email,phoneNumber}=req.body
        Profile.update({
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
        .catch((err) => {
            console.log(err);
            res.send(err)
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