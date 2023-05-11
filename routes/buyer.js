const router = require('express').Router()
const Controller = require('../controllers/buyer-controller')

router.get("/", Controller.buyerHome)

module.exports = router