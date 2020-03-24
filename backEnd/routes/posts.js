const express = require('express');

const PostController = require('../controllers/posts');
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();



/** create post router */
router.post('', checkAuth, extractFile , PostController.createPost)

/** update post router */
router.put('/:id', checkAuth, extractFile , PostController.updatePost)

/** get all posts router */
router.get('', PostController.getPosts )

/** get single post router */
router.get('/:id', checkAuth, PostController.getPost)

/** delete post router */
router.delete('/:id', checkAuth, PostController.deletePost)

module.exports = router;
