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
                    res.redirect('/seller/dashboard')
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

    static addProfile(req, res){
        const id = req.session.userId
        User.findByPk(id)
            .then(user => {
                res.render('seller-add-profile', { user, id })
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static createProfile(req, res){
        const UserId = req.session.userId
        const { name, address, email, phoneNumber } = req.body
        Profile.create({
            name,
            address,
            email,
            phoneNumber,
            UserId
        })
            .then(() => {
                res.redirect('/seller/dashboard')
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static sellerDashboard(req,res){
        const id = req.session.userId
        const CategoryId = req.query.CategoryId
        const options ={
            where:{
                SellerId: id
            },
            include:{
                model: Category
            }
        }
        if(CategoryId){
            options.where.CategoryId = CategoryId
        }

        Product.findAll(options)
        .then((products)=>{
            Category.findAll()
            .then((categories) => {
                res.render('seller-dashboard', {products, categories, rupiah})
            })
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static transactionList(req, res){
        const id = req.session.userId
        Transaction.findAll({
            include:{
                model: ProductsTransaction,
                include:{
                    model:Product,
                    where:{
                        SellerId: id
                    }
                }
            }
        })
        .then((transactions) => {
            // res.send(transactions)
            res.render('seller-transaction', {transactions, rupiah})
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static productDetail(req, res){
        const id = req.params.id
        Product.findByPk(id,{
            include:{
                model: Category
            }
        })
        .then((product)=>{
            res.render('seller-product-detail', {product, rupiah})
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

    static deleteProduct(req, res){
        const id = req.params.id
        Product.destroy({
            where:{
                id: id
            }
        })
        .then(() => {
            res.redirect("/seller/dashboard")
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    }

    static deliverProduct(req, res){
        const id = req.params.id
        console.log(id)
        Transaction.update({
            deliveredDate: new Date(),
            status: "Completed"
        }, {
            where:{
                id: id
            }
        })
        .then(() => {
            res.redirect("/seller/transaction")
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
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