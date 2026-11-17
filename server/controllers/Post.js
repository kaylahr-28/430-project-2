const models = require('../models');
const Post = models.Post;

const makerPage = async (req, res) => {
    return res.render('app');
};

const makePost = async (req, res) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'Both name and age are required!' });
    }

    //part e- adding description of the domo
    const postData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id,
        desc: req.body.desc,
    };

    try {
        const newPost = new Post(postData);
        await newPost.save();
        return res.status(201).json({ name: newPost.name, age: newPost.age, desc: newPost.desc ? newPost.desc : '' });

    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Post already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred while making post!' });
    }
}

const getPosts = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Post.find(query).select('name age desc').lean().exec();
        return res.json({ posts: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving posts :(' });
    }
};

module.exports = {
    makerPage, makePost, getPosts
};