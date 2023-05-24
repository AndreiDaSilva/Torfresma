const express = require('express')
const router = express.Router();
const login = require('../middleware/login');


const UserControllers = require('../controllers/user-controllers');

router.get('/', UserControllers.getUsers);
router.get('/:id_user', UserControllers.getUserId);

router.post('/cadastro', UserControllers.postNewUser);
router.post('/login', UserControllers.postLoginUser);

router.put('/', login.obrigatorio, UserControllers.putUser);

router.delete('/', login.obrigatorio, UserControllers.deleteUser);

module.exports = router;
