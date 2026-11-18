const models = require('../models');
const Post = models.Post;

const makerPage = async (req, res) => {
    return res.render('app');
};

const makePost = async (req, res) => {
    if (!req.body.title || !req.body.rank || !req.body.artist) {
        return res.status(400).json({ error: 'Both song title, artist, and ranking are required!' });
    }

    //part e- adding description of the domo
    const postData = {
        title: req.body.title,
        rank: req.body.rank,
        artist: req.body.artist,
        owner: req.session.account._id,
        desc: req.body.desc,
        date: req.body.date,
    };

    try {
        const newPost = new Post(postData);
        await newPost.save();
        return res.status(201).json({ title: newPost.title, artist: newPost.artist, rank: newPost.rank, desc: newPost.desc ? newPost.desc : '', date: newPost.date });

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
        const docs = await Post.find(query).select('title artist rank desc date').lean().exec();
        return res.json({ posts: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving posts :(' });
    }
};

module.exports = {
    makerPage, makePost, getPosts
};