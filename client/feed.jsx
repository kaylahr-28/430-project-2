const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handlePost = (e, onPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#domoName").value;
    const age = e.target.querySelector("#domoAge").value;
    const desc = e.target.querySelector('#domoDesc').value;
    if (!desc) desc = '';

    if (!name || !age) {
        helper.handleError(('All fields are required!'));
        return false;
    }

    helper.sendPost(e.target.action, { name, age, desc }, onPostAdded);
    return false;
}

const PostForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age' />
            <label htmlFor='desc'>Description: </label>
            <input id='domoDesc' type='text' name='desc' placeholder='Domo Description' />

            <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        </form>
    );
};

const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

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
                <h3 className='domoName'>Name: {post.name}</h3>
                <h3 className='domoAge'>Age: {post.age}</h3>
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

    return (
        <div>
            <div id='makeDomo'>
                <PostForm triggerReload={() => setReloadPosts(!reloadPosts)} />
            </div>
            <div id='domos'>
                <PostList posts={[]} reloadPosts={reloadPosts} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
