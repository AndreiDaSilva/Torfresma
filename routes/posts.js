const express = require('express');
const router = express.Router();
const login = require('../middleware/login');


const PostControllers = require('../controllers/postControllers');

router.get('/', PostControllers.getPosts);
router.get('/:id_post', PostControllers.getPostId);
router.get('/user/:id_user', PostControllers.getPostUser);

router.post('/', login.obrigatorio, PostControllers.postNewPost);

router.put('/:id_post', login.obrigatorio, PostControllers.putPost);

router.delete('/:id_post', login.obrigatorio, PostControllers.deletePost);

module.exports = router;
