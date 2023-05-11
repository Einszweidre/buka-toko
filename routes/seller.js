const express = require('express')
const Controller = require('../controllers/seller-controller')
const router = express()

router.get("/", Controller.sellerHome)

module.exports = router