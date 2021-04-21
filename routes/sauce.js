const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.put ('/:id', auth, sauceController.dislikeSauce) 
router.put ('/:id', auth, sauceController.likeSauce) 
router.post('/', auth, multer,  sauceController.createSauce);
router.get('/', auth, sauceController.getAllSauces);
router.get('/:id', auth, sauceController.getOneSauce);
router.put('/:id', auth, multer, sauceController.modifyOneSauce);
router.delete('/:id', auth, sauceController.deleteSauce);


module.exports = router;