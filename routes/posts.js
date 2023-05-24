const express = require('express');
const router = express.Router();
const login = require('../middleware/login');


const PostControllers = require('../controllers/post-controllers');

router.get('/', PostControllers.getPosts);
router.get('/:id_post', PostControllers.getPostId);
router.get('/user/:id_user', PostControllers.getPostUser);

router.post('/', login.obrigatorio, PostControllers.postNewPost);

router.delete('/:id_post', login.obrigatorio, PostControllers.deletePost);

router.put('/:id_post', login.obrigatorio, PostControllers.putPost);

module.exports = router;
