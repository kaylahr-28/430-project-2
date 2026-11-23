const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');




const handlePost = (e, onPostAdded) => {

    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector("#songTitle").value;
    const artist = e.target.querySelector("#songArtist").value;
    const rank = e.target.querySelector("#songRank").value;
    let desc = e.target.querySelector('#songDesc').value;
    if (!desc) desc = '';

    if (!title || !rank || !artist) {
        helper.handleError(('All fields are required!'));
        return false;
    }

    helper.sendPost(e.target.action, { title, artist, rank, desc }, onPostAdded);
    return false;
}

const CreatePostBtn = ({ onShowPopup }) => {
    return (
        <button id='createBtn' onClick={onShowPopup}>Create Post!</button>
    );
}

const PostForm = ({ props, showPopup, closePopup }) => {

    useEffect(() => {

        if (showPopup) {
            helper?.showPostForm();
        } else {
            helper?.hidePostForm();

        }
    }, [showPopup]);
    return (<div id="postOverlay">
        <div id='postContentClose' onClick={(e) => e.stopPropagation()}>

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

    const formatDate = (date) => {
        const dateFormat = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        return dateFormat.format(date);
    }

    //open and close create post popup
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
            <div className='postList'>
                <h3 className='emptyPosts'>No Posts Yet...</h3>
            </div>
        );
    }

    const postNodes = posts.map(post => {
        return (
            <div key={post._id} className='post'>
                <img src='/assets/img/musicnote.png' alt='music note' className='domoFace' />
                <h3 className='songTitle'>{post.title} by {post.artist}</h3>
                <h3 className='songRank'>Rank: {post.rank}/5</h3>
                {/**if a description was given, add it to display */}
                {post.desc ? <p className='songDesc'>{post.desc}</p> : <></>}
                <h4>Created {formatDate(post.dateCreated)}</h4>
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

            <div id="posts">
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
