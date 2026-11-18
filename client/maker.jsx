const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
import Popup from './Popup.jsx';



const handlePost = (e, onPostAdded) => {
    // if (isCanceled) {
    //     helper.hidePostForm();
    //     setisCanceled(false);
    //     return;
    // }
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#songName").value;
    const rank = e.target.querySelector("#songRank").value;
    let desc = e.target.querySelector('#songDesc').value;
    if (!desc) desc = '';

    if (!name || !age) {
        helper.handleError(('All fields are required!'));
        return false;
    }

    helper.sendPost(e.target.action, { name, rank, desc }, onPostAdded);
    //  setisCanceled(false);
    return false;
}

const CreatePostBtn = ({ onShowPopup }) => {
    return (
        <button id='createBtn' onClick={onShowPopup}>Create Post!</button>
    );
}

const PostForm = ({ showPopup, closePopup }) => {

    useEffect(() => {

        if (showPopup) {
            helper?.showPostForm();
        } else {
            helper?.hidePostForm();

        }
    }, [showPopup]);
    return (<div id="postOverlay">
        <div id='postContentClose' onClick={(e) => e.stopPropagation()}>
            {/* {children} */}
            <form id='postForm'
                onSubmit={(e) => handlePost(e, props.triggerReload)}
                name='postForm'
                action='/maker'
                method='POST'
                className='postForm'>

                <label htmlFor='songName'>Song Title: </label>
                <input id='songName' type='text' name='title' placeholder='Song Name' />
                <label htmlFor='songArtist'>Artist: </label>
                <input id='songArtist' type='text' name='artist' placeholder='Artist Name' />

                <label htmlFor='songRank'>Ranking (/5): </label>
                <input id='songRank' type='number' min='0' max='5' name='rank' />
                <label htmlFor='songDesc'>Description: </label>
                <input id='songDesc' type='text' name='desc' placeholder='Reasoning' />

                <input className='makePostSubmit' type='submit' value='Create Post' />
            </form>
            <button className='closePopup' type='button' onClick={closePopup} >Cancel</button>

        </div>
    </div>

    );

};

const PostList = (props, showPopup) => {
    const [posts, setPosts] = useState(props.posts);

    useEffect(() => {

        if (showPopup) {
            helper?.showPostForm();
        } else {
            if (document.getElementById('postOverlay')) {
                helper?.hidePostForm();

            }
        }
    }, [showPopup]);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPosts');
            const data = await response.json();
            setPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);

    if (posts.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Posts Yet...</h3>
            </div>
        );
    }

    const postNodes = posts.map(post => {
        return (
            <div key={post._id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='domoTitle'>{post.title} by {post.artist}</h3>
                <h3 className='domoAge'>Rank: {post.rank}/5</h3>
                {/**if a description was given, add it to display */}
                {post.desc ? <p className='domoDesc'>{post.desc}</p> : <></>}
            </div>
        );
    });

    return (
        <div className='domoList'>
            {postNodes}
        </div>
    );
};
const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>
            <CreatePostBtn
                onShowPopup={() => setShowPopup(true)} />

            {showPopup ? <div id="makeDomo">
                <PostForm
                    showPopup={showPopup}
                    closePopup={() => setShowPopup(false)}
                    triggerReload={() => setReloadPosts(!reloadPosts)} />

            </div>
                : null}

            <div id="domos">
                <PostList posts={[]}
                    showPopup={showPopup}

                    reloadPosts={reloadPosts} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
