const { createJazzCashPayment } = require('../controllers/paymentsController')
const { Router } = require('express')
const { auth } = require('../middlewares/auth')
const router = Router()

router.post('/jazzcash', auth, createJazzCashPayment)

module.exports = router

