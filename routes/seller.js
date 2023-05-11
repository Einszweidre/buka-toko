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
router.get("/logout", Controller.logout)



module.exports = router