const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get("/", Controller.showHome)
router.get("/register", Controller.registerForm)
router.post("/register", Controller.registerPost)
router.use("/buyer", require("./buyer"))
router.use("/seller", require("./seller"))

module.exports = router