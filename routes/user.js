const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const ValidationMiddleware = require("../middlewares/validationHandler");


router.get('/', UserController.list);
router.post('/', ValidationMiddleware(UserController.createSchema), UserController.create);
router.get('/:id', UserController.find);
router.put('/:id', ValidationMiddleware(UserController.createSchema), UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;