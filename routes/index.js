const express = require('express')
const Controller = require('../controllers/controller')
const router = express()

router.get("/", Controller.showHome)

router.use("/buyer", require("./buyer"))
router.use("/seller", require("./seller"))

module.exports = router