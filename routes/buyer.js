const router = require('express').Router()
const Controller = require('../controllers/buyer-controller')

router.get("/", Controller.buyerHome)
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
router.get("/profile/add", Controller.addProfile)
router.post("/profile/add", Controller.addProfilePost)
router.get("/dashboard", Controller.buyerDashboard)
router.get("/profile/edit", Controller.editProfile)
router.post("/profile/edit", Controller.editProfilePost)
router.get("/cart", Controller.cart)
router.get("/productdetail/:id", Controller.productDetail)
router.get("/checkout", Controller.checkout)
router.get("/payment", Controller.payment)
router.get("/transactions", Controller.transactions)
router.post("/payment", Controller.paymentPost)
router.get("/logout", Controller.logout)
module.exports = router