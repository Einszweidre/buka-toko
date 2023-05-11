const express = require('express')
const Controller = require('../controllers/buyer-controller')
const router = express()

router.get("/", Controller.buyerHome)

module.exports = router