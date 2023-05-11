const router = require('express').Router()
const Controller = require('../controllers/buyer-controller')

router.get("/", Controller.buyerHome)
router.post("/",Controller.loginPost)
module.exports = router