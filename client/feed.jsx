const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const io = require('socket.io-client');
const socket = io();

const FeedHeader = (props) => {
    return (
        <h1>My Feed</h1>
    );
};

const FeedList = (props) => {
    const [feed, setFeed] = useState([]);
    const formatDate = (date) => {
        const dateFormat = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        });
        return dateFormat.format(date);
    }
    useEffect(() => {
        socket.connect();
        const loadFeedFromServer = async () => {
            const response = await fetch('/getFeed');
            const data = await response.json();
            console.log('my feed:', data.feed);
            setFeed(data.feed);
        };
        socket.on('data_changed', loadFeedFromServer);

        return () => {
            socket.off('data_changed', loadFeedFromServer);
            socket.disconnect();
        };
    }, []);

    //watch account for changes and update feed whenever there's a change

    if (feed.length === 0) {
        return (
            <div className='postList'>
                <h3 className='emptyPosts'>Your feed is looking quiet ...</h3>
            </div>
        );
    }
    const userNodes = users.map(user => {
        return (
            <div key={user._id} className='user'>
                <img src='/assets/img/musicnote.png' alt='music note' className='domoFace' />
                <h3 className='username'>Username: {user.username}</h3>
                <h4>Joined {formatDate(user.dateCreated)}</h4>

            </div>
        );
    });

    return (
        <div className='postList'>
            {userNodes}
        </div>
    );
};



const App = () => {
    const [reloadFeed, setReloadFeed] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>did it work
            {/* <CreatePostBtn
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
            </div> */}

            <div>
                <FeedHeader />
                <div id='posts'>
                    <FeedList
                        triggerReload={() => setReloadFeed(!reloadFeed)}
                        reloadFeed={reloadFeed} />
                </div>
            </div>

        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('feed'));
    root.render(<App />);
};

window.onload = init;
