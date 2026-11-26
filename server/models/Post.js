
const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const dateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
});

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    artist: {
        type: String,
        required: true,
        trim: true,
    },
    rank: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: dateFormat.format(new Date),
    },
    desc: {
        type: String,
    },
    username: {
        type: String,
        required: true,

    }
});

PostSchema.statics.toAPI = (doc) => ({
    title: doc.title,
    artist: doc.artist,
    rank: doc.rank,
    desc: doc.desc,
    date: doc.createdDate,
    username: doc.username,
});

const PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;
