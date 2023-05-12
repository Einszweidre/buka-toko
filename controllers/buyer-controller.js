const { Product, Category, Profile, Transaction, ProductsTransaction, User } = require('../models')
const bcrypt = require('bcrypt')
const rupiahFormat = require('../helpers/rupiahFormat')
const easyinvoice = require('easyinvoice');
const fs = require('fs');

class Controller {
    static buyerHome(req, res) {
        const { error } = req.query
        res.render('buyer', { error })
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
                        if (user.role !== "Buyer") {
                            const error = "not a buyer account"
                             res.redirect(`/buyer?error=${error}`)
                        }
                        req.session.userId = user.id
                        req.session.role = user.role
                        req.session.name = user.username
                        // return Profile.findOne({
                        //     where: {
                        //         UserId: user.id
                        //     } 
                        // })
                        res.redirect('/buyer/dashboard')
                    } else {
                        const error = "invalid password"
                         res.redirect(`/buyer?error=${error}`)
                    }
                } else {
                    const error = "username not found"
                     res.redirect(`/buyer?error=${error}`)
                }
            })
            // .then(profile => {
            //     if (!profile) {
            //         res.redirect('/buyer/profile/add')
            //     } else {
            //         req.session.address=profile.address
            //         res.redirect('/buyer/dashboard')
            //     }
            // })
            .catch((err) => {
                if (err.name === 'SequelizeValidationError') {
                    const errors = err.errors.map((el) => el.message)
                    res.redirect(`/buyer?error=${errors}`)
                } else {
                    console.log(err);
                    res.send(err)
                }
            })
    }

    static addProfile(req, res) {
        const { error } = req.query
        const id = req.session.userId
        User.findByPk(id)
            .then(user => {
                res.render('add-profile', { user, id ,error})
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static addProfilePost(req, res) {
        const UserId = req.session.userId
        const { name, address, email, phoneNumber } = req.body
        Profile.create({
            name,
            address,
            email,
            phoneNumber,
            UserId
        })
            .then(_ => {
                res.redirect('/buyer/dashboard')
            })
            .catch((err) => {
                if (err.name === 'SequelizeValidationError') {
                    const errors = err.errors.map((el) => el.message)
                    res.redirect(`/buyer/profile/add?error=${errors}`)
                } else {
                    console.log(err);
                    res.send(err)
                }
            })
    }

    static addToCart(req, res) {
        const { id, name, price, CategoryId } = req.body
        const { cart } = req.session
        if (req.body.name) {
            let product = {
                id,
                name,
                price,
                CategoryId,
                quantity: 1
            }
            const find = cart.find((el) => el.name == name)
            if (find) {
                find.quantity++
            } else {
                req.session.cart.push(product);
            }
            res.redirect('/buyer/dashboard');
        }
    }

    static updateQuantity(req, res) {
        let { cart } = req.session
        const { quantity, index } = req.body
        cart[index].quantity = quantity
        res.redirect('/buyer/cart')
    }

    static deleteCart(req, res) {
        const deleteItem = req.query.item
        let { cart } = req.session
        req.session.cart = cart.filter(el => el.name !== deleteItem)
        res.redirect('/buyer/cart')
    }

    static buyerDashboard(req, res) {
        //cart
        let itemsInCart
        if (req.session.cart) {
            itemsInCart = req.session.cart.length;
        } else {
            itemsInCart = 0
            req.session.cart = [];
        }
        //dashboard
        const { name } = req.session
        let categories
        Category.findAll()
            .then((categoriesList) => {
                categories = categoriesList
                let option = {}
                if (req.query.CategoryId) {
                    const { CategoryId } = req.query
                    option.where = {
                        CategoryId
                    }
                }
                console.log(option);
                return Product.findAll(option)
            })
            .then((products) => {
                res.render('buyer-dashboard', { products, categories, name, itemsInCart })
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static editProfile(req, res) {
        const { error } = req.query
        const UserId = req.session.userId
        Profile.findOne({
            where: {
                UserId
            }
        })
            .then((profile) => {
                if(!profile){
                    res.redirect('/buyer/profile/add')
                } else {
                    res.render('buyer-edit-profile', { profile ,error})
                }
            })
            .catch(err => {
                res.send(err)
                console.log(err);
            })
    }

    static editProfilePost(req, res) {
        const UserId = req.session.userId
        const { name, address, email, phoneNumber } = req.body
        Profile.update({
            name,
            address,
            email,
            phoneNumber,
            // UserId=id?
        },
            {
                where: {
                    UserId
                }
            })
            .then(_ => {
                res.redirect('/buyer/dashboard')
            })
            .catch((err) => {
                if (err.name === 'SequelizeValidationError') {
                    const errors = err.errors.map((el) => el.message)
                    res.redirect(`/buyer/profile/edit?error=${errors}`)
                } else {
                    console.log(err);
                    res.send(err)
                }
            })
    }

    static checkout(req, res) {
        const UserId = req.session.userId
        const address=req.session.address
        if (req.session.cart.length > 0) {
            Transaction.create({
                paymentDate: new Date(),
                status:'Paid',
                UserId,
                deliveryAddress:address
            })
            .then(()=>{
               return Transaction.findOne({
                    where: {
                        UserId,
                    },
                    order: [['id', 'DESC']],
                    limit: 1
                })
            })
            .then((transaction)=>{
                console.log(transaction);
                const cart=req.session.cart
                cart.forEach(el => {
                    el.TransactionId=transaction.id
                    el.ProductId=el.id
                    el.amount= +el.quantity * +el.price
                    delete el.CategoryId
                    delete el.id
                    delete el.name
                }); 
                return ProductsTransaction.bulkCreate(cart)
            })
            .then(()=>{
                req.session.cart=[]
                res.redirect('/buyer/dashboard')
            })
        } else {
            const error = "Cart is empty"
            return res.redirect(`/buyer/cart?error=${error}`)
        }

    }

    static productDetail(req, res) {
        const { id } = req.params
        Product.findByPk(id)
            .then(product => {
                res.render('buyer-product-detail',{product})
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static cart(req, res) {
        console.log(req.session.cart);
        const { error } = req.query
        const cart = req.session.cart
        let totalPrice = 0
        cart.forEach(el => {
            totalPrice += +el.price * el.quantity
        });
        res.render('buyer-cart', { cart, totalPrice, rupiahFormat, error })
    }

    static transactions(req, res) {
        const UserId=req.session.userId
        Transaction.findAll({
            where:{
                UserId
            }
        })
        .then((transactions)=>{
            res.render('buyer-transactions',{transactions})
        })
    }

    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/')
            }
        })
    }
}


module.exports = Controller