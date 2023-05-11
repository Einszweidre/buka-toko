const router = require('express').Router()
const Controller = require('../controllers/seller-controller')

router.get("/", Controller.sellerHome)
router.post("/",Controller.loginPost)
module.exports = router