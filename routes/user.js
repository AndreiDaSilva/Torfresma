const express = require('express')
const router = express.Router();
const login = require('../middleware/login');


const userControllers = require('../controllers/userControllers');

router.get('/', userControllers.getUsers);
router.get('/:id_user', userControllers.getUserId);

router.post('/cadastro', userControllers.postNewUser);
router.post('/login', userControllers.postLoginUser);

router.put('/', login.obrigatorio, userControllers.putUser);

router.delete('/', login.obrigatorio, userControllers.deleteUser);

module.exports = router;
