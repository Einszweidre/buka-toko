const { Product, Category,Profile,Transaction,ProductsTransaction,User } = require('../models')
const bcrypt = require('bcrypt')
const rupiah = require('../helpers/rupiahFormat')

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
                    if(user.role !== "Seller"){
                        const error = "not a seller account"
                        return res.redirect(`/seller?error=${error}`)
                    }
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
            console.log(err)
            res.send(err)
        })
    }

    static sellerDashboard(req,res){
        const id = req.session.userId
        Product.findAll({
            where:{
                SellerId: id
            },
            include:{
                model: Category
            }
        })
        .then((products)=>{
            res.render('seller-dashboard', {products, rupiah})
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static transactionList(req, res){
        
    }

    static productDetail(req, res){
        const id = req.params.id
        Product.findByPk(id,{
            include:{
                model: Category
            }
        })
        .then((product)=>{
            res.send(product)
            res.render('product-detail', {product, rupiah})
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static addProduct(req, res){
        Category.findAll()
        .then((categories)=>{
            res.render("seller-product-add", {categories})
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static createProduct(req, res){
        const {name, description, price, CategoryId, picture} = req.body
        const SellerId = req.session.userId
        Product.create({name, description, price ,SellerId , CategoryId, picture})
        .then(()=>{
            res.redirect("/seller/dashboard")
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static editProduct(req, res){
        const id = req.params.id
        Product.findByPk(id, {
            include:{
                model: Category
            }
        })
        .then((product) => {
            Category.findAll()
            .then((categories) => {
                res.render("seller-product-edit", {product, categories})
            })
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static postProduct(req, res){
        const {name, description, price, CategoryId, picture} = req.body
        const SellerId = req.session.userId
        const id = req.params.id
        Product.update({name, description, price ,SellerId , CategoryId, picture},{
            where:{
                id: id
            }
        })
        .then(()=>{
            res.redirect("/seller/dashboard")
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static transactionList(req, res){

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