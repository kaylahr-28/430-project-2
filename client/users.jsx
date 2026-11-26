const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const io = require('socket.io-client');
const socket = io();

const handleFollow = (e, onFollowClick, id) => {
    let userId = id;
    e.preventDefault();
    helper.hideError();
    console.log('id', userId);
    helper.sendPost(e.target.action, { userId }, onFollowClick);
    return false;
}

const UserHeader = (props) => {
    return (
        <h1>All Users</h1>
    );
};

const FollowButton = (props) => {
    const [isFollowed, setIsFollowed] = useState(false);
    const [btnVal, setBtnVal] = useState('Follow')
    useEffect(() => {
        if (isFollowed) setBtnVal("Unfollow"); else setBtnVal("Follow");

    }, [isFollowed])
    return (
        <input type='submit' onClick={() => setIsFollowed(!isFollowed)} value={btnVal} />
    )
}

const UserList = (props) => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const formatDate = (date) => {
        const dateFormat = new Intl.DateTimeFormat('en-US', {
            month: 'long',
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
        const loadUsersFromServer = async () => {
            const myRes = await fetch('/getSelf');
            const myData = await myRes.json();
            setFollowing(myData);

            console.log('acc data from user pg', myData);
            const response = await fetch('/getUsers');
            const data = await response.json();
            setUsers(data.users);

        };
        loadUsersFromServer();
    }, [props.reloadUsers]);




    useEffect(() => {
        console.log('following:', following)
        console.log('users:', users)

        //     const loadFeedFromServer = async () => {
        //         const response = await fetch('/getFeed');
        //         const data = await response.json();
        //         console.log('my feed:', data.feed);
        //         setFeed(data.feed);
        //     };

        //     loadFeedFromServer();

    }, [following, users]);







    if (users.length === 0) {
        return (
            <div className='postList'>
                <h3 className='emptyPosts'>No Other Users Yet...</h3>
            </div>
        );
    }
    const userNodes = users.map(user => {
        console.log('the userid', user._id);
        return (<form onSubmit={(e) => {
            handleFollow(e, props.triggerReload, user._id);
        }}
            name='postForm'
            action='/controlFollow'
            method='POST'
            className='postForm'>
            <div key={user._id} className='user'>
                <img src='/assets/img/musicnote.png' alt='music note' className='postImg' />
                <h3 className='username'>Username: {user.username}</h3>
                <h4>Joined {formatDate(user.dateCreated)}</h4>



                <input type='submit' value={following.length > 0 && following.includes(user._id) ? "Unfollow" : "Follow"} />

            </div></form >
        );
    });

    return (
        <div className='postList'>
            {userNodes}
        </div>
    );
};

const App = () => {
    const [reloadUsers, setReloadUsers] = useState(false);
    return (
        <div>
            <UserHeader />
            <div id='posts'>
                <UserList
                    triggerReload={() => setReloadUsers(!reloadUsers)}
                    reloadUsers={reloadUsers} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('users'));
    root.render(<App />);
};

window.onload = init;
