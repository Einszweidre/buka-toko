const router = require('express').Router()
const Controller = require('../controllers/seller-controller')

router.get("/", Controller.sellerHome)
router.post("/",Controller.loginPost)

router.use((req, res, next) => {
    console.log(req.session)

    if(!req.session.userId){
        const error = "Session not found, please login"
        res.redirect(`/seller?error=${error}`)
    } else{
        next()
    }
})

router.get("/dashboard", Controller.sellerDashboard)

router.get("/profile/add", Controller.addProfile)
router.post("/profile/add", Controller.createProfile)

router.get("/transaction", Controller.transactionList)

router.get("/product/detail/:id", Controller.productDetail)

router.get("/product/add", Controller.addProduct)
router.post("/product/add", Controller.createProduct)

router.get("/product/edit/:id", Controller.editProduct)
router.post("/product/edit/:id", Controller.postProduct)

router.get("/product/delete/:id", Controller.deleteProduct)

router.get("/product/deliver/:id", Controller.deliverProduct)

router.get("/logout", Controller.logout)



module.exports = router