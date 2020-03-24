const Post = require('../models/post');

exports.createPost =  (request, response, next) => {
    const url = request.protocol + '://' + request.get('host');
    const post = new Post({
        title: request.body.title,
        content: request.body.content,
        imagePath: url + '/images/' + request.file.filename,
        creator: request.userData.userId
    })
    post.save().then(createdPost => {
        response.status(201).json({
            message: "post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id,
                // title: createdPost.title,
                // content: createdPost.content,
                // imagePath: createdPost.imagePath
            }
        })
    })
    .catch(error =>{
        response.status(500).json({
            message:"Creating a post failed!"
        })
    });

};


exports.updatePost = (request, response, next) => {
    let imagePath = request.body.imagePath;
    if (request.file) {
        const url = request.protocol + '://' + request.get('host');
        imagePath = url + '/images/' + request.file.filename;
    }
    const post = new Post({
        _id: request.body.id,
        title: request.body.title,
        content: request.body.content,
        imagePath: imagePath,
        creator: request.userData.userId
        
    })
    console.log(post)
    Post.updateOne({ _id: request.params.id , creator:request.userData.userId }, post).then(result => {
        if (result.n > 0) {
            response.status(200).json({ message: "Updated successful!" })
        }
        response.status(401).json({ message: "Not Authorized to Update!" })
    }) 
    .catch(error =>{
        response.status(500).json({
            message:"Couldn't Update Post!"
        })
    });
};


exports.getPosts =  (request, response, next) => {
    const pageSize = +request.query.pagesize;
    const currentPage = +request.query.page;
    const psotQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        psotQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    psotQuery
        .then(documents => {
            fetchedPosts = documents
            return Post.countDocuments()
        })
        .then((count) => {
            response.status(200).json({
                message: 'post fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            })
        })
        .catch(error =>{
            response.status(500).json({
                message:"Fetching  posts failed!"
            })
        });

};


exports.getPost = (request, response, next) => {
    Post.findById({ _id: request.params.id })
        .then(post => {
            if (post) {
                response.status(200).json(post)
            } else {
                response.status(404).json({ message: "Post Not Found!" })
            }
        })
        .catch(error =>{
            response.status(500).json({
                message:"Fetching a post failed!"
            })
        });
};


exports.deletePost = (request, response, next) => {

    Post.deleteOne({ _id: request.params.id ,  creator:request.userData.userId })
        .then(result => {

            if (result.n  > 0) {
                response.status(200).json({ message: "Deletion successful!" })
            }
            response.status(401).json({ message: "Not Authorized to Update!" })
        })
        .catch(error =>{
            response.status(500).json({
                message:"Deleting a post failed!"
            })
        });

}