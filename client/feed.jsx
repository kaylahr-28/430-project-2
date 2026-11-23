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
            day: 'numeric',
            year: 'numeric'
        });
        return dateFormat.format(date);
    }

    useEffect(() => {
        socket.connect();

        //change trigger reload whenever event is sent
        socket.on('data_changed', props.triggerReload);

        return () => {
            socket.off('data_changed', props.triggerReload);
            socket.disconnect();
        };
    }, []);


    useEffect(() => {

        const loadFeedFromServer = async () => {
            const response = await fetch('/getFeed');
            const data = await response.json();
            console.log('my feed:', data.feed);
            setFeed(data.feed);
        };

        loadFeedFromServer();

    }, [props.reloadFeed]);

    //watch account for changes and update feed whenever there's a change

    if (feed.length === 0) {
        return (
            <div className='postList'>
                <h3 className='emptyPosts'>Your feed is looking quiet ...</h3>
            </div>
        );
    }
    // const userNodes = users.map(user => {
    //     return (
    //         <div key={user._id} className='user'>
    //             <img src='/assets/img/musicnote.png' alt='music note' className='domoFace' />
    //             <h3 className='username'>Username: {user.username}</h3>
    //             <h4>Joined {formatDate(user.dateCreated)}</h4>

    //         </div>
    //     );
    // });

    const postNodes = feed.map(post => {
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
        <div className='postList'>
            {postNodes}
        </div>
    );
};



const App = () => {
    const [reloadFeed, setReloadFeed] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>

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
