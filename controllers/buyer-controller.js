const { Product, Category,Profile,Transaction,ProductsTransaction,User } = require('../models')
const bcrypt = require('bcrypt')
const rupiahFormat=require('../helpers/rupiahFormat')

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
                        if(user.role !== "Buyer"){
                            const error = "not a buyer account"
                            return res.redirect(`/buyer?error=${error}`)
                        }
                        req.session.userId = user.id
                        req.session.role = user.role
                        return Profile.findOne({
                            where:{
                                UserId:user.id
                            }
                        })
                    } else {
                        const error = "invalid password"
                        return res.redirect(`/buyer?error=${error}`)
                    }
                } else {
                    const error = "username not found"
                    return res.redirect(`/buyer?error=${error}`)
                }
            })
            .then(profile=>{
                if(!profile){
                    res.redirect('/buyer/profile/add')
                } else {
                    res.redirect('/buyer/dashboard')
                }
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static addProfile(req, res) {
        const id=req.session.userId
        User.findByPk(id)
        .then(user=>{
            res.render('add-profile',{user,id})
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
    }

    static addProfilePost(req, res) {
        const UserId=req.session.userId
        const {name,address,email,phoneNumber}=req.body
        Profile.create({
            name,
            address,
            email,
            phoneNumber,
            UserId
        })
        .then(_=>{
            res.redirect('/buyer/dashboard')
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
    }

    static addToCart(req, res) {
        const{id,name,price,CategoryId}=req.body
        const {cart}=req.session
        if (req.body.name) {
            let product={
                id,
                name,
                price,
                CategoryId,
                quantity:1
            }
            const find=cart.find((el) => el.name==name)
            if(find){
               find.quantity++
            } else {
                req.session.cart.push(product);
            }
            res.redirect('/buyer/dashboard');
        }
    }

    static updateQuantity(req, res) {
        let {cart}=req.session
        const{quantity,index}=req.body
        cart[index].quantity=quantity
        res.redirect('/buyer/cart')
    }

    static deleteCart(req, res) {
       const deleteItem=req.query.item
       let {cart}=req.session
       req.session.cart=cart.filter(el=>el.name!==deleteItem)
       res.redirect('/buyer/cart')
    }

    static buyerDashboard(req, res) {
        //cart
        if (req.session.cart) {
            const itemsInCart = req.session.cart.length;
        } else {
            req.session.cart = [];
        }

        //dashboard
        const id=req.session.userId
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
        const UserId=req.session.userId
        Profile.findOne({
            where:{
                UserId
            }
        })
        .then(profile=>{
            res.render('buyer-edit-profile',{profile})
        })
        .catch(err=>{
           res.send(err)
           console.log(err); 
        })  
    }

    static editProfilePost(req, res) {
        const UserId=req.session.userId
        const {name,address,email,phoneNumber}=req.body
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
        .then(_=>{
            res.redirect('/buyer/dashboard')
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
        const {cart}=req.session
        let totalPrice=0
        cart.forEach(el => {
            totalPrice+= +el.price*el.quantity
        });
        res.render('buyer-cart',{cart,totalPrice ,rupiahFormat})
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