const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handleFollow = (e, onFollowClick, id) => {

    e.preventDefault();
    helper.hideError();

    // const title = e.target.querySelector("#songTitle").value;
    // const artist = e.target.querySelector("#songArtist").value;
    // const rank = e.target.querySelector("#songRank").value;
    // let desc = e.target.querySelector('#songDesc').value;
    // if (!desc) desc = '';

    // if (!title || !rank || !artist) {
    //     helper.handleError(('All fields are required!'));
    //     return false;
    // }

    helper.sendPost(e.target.action, { id }, onFollowClick);
    return false;
}

const UserHeader = (props) => {
    return (
        <h1>All Users</h1>
    );
};

const UserList = (props) => {
    const [users, setUsers] = useState([]);
    const formatDate = (date) => {
        const dateFormat = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        });
        return dateFormat.format(date);
    }
    useEffect(() => {
        const loadUsersFromServer = async () => {
            const response = await fetch('/getUsers');
            const data = await response.json();
            setUsers(data.users);
        };
        loadUsersFromServer();
    }, [props.reloadUsers]);

    if (users.length === 0) {
        return (
            <div className='postList'>
                <h3 className='emptyPosts'>No Other Users Yet...</h3>
            </div>
        );
    }
    const userNodes = users.map(user => {
        return (<form onSubmit={(e) => handleFollow(e, props.triggerReload, user._id)}
            name='postForm'
            action='/controlFollow'
            method='POST'
            className='postForm'>
            <div key={user._id} className='user'>
                <img src='/assets/img/musicnote.png' alt='music note' className='domoFace' />
                <h3 className='username'>Username: {user.username}</h3>
                <h4>Joined {formatDate(user.dateCreated)}</h4>



                <input type='submit' value='Follow' />

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
