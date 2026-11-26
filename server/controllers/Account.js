const models = require('../models');
const Account = models.Account;
const mongoose = require('mongoose');

const loginPage = (req, res) => {
    return res.render('login');
};

const moreUsersPage = async (req, res) => {
    return res.render('users');
}

const getUsers = async (req, res) => {
    try {
        //find all users EXCEPT user's own account
        const query = { _id: { $ne: req.session.account._id } };
        const docs = await Account.find(query);

        return res.json({ users: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving users :(' });
    }
};

const getSelf = async (req, res) => {
    try {
        const myAccount = await Account.findOne({ _id: req.session.account._id });
        return res.json({ following: myAccount.following });

    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'An error occurred while receiving user data!' });

    }
}
const controlFollow = async (req, res) => {

    try {  //find user that is being (un)followed
        //keep as object id
        const user = mongoose.Types.ObjectId.createFromHexString(req.body.userId);
        const myAccount = await Account.findOne({ _id: req.session.account._id });
        console.log('user:', user);


        //if im already following user, unfollow
        if (myAccount.following.includes(user)) {
            myAccount.following.pull(user);
        } else {
            //follow
            myAccount.following.push(user);

        };
        const io = req.app.get('io');

        await myAccount.save();
        console.log(myAccount);

        // Broadcast change to all connected React clients
        io.emit('data_changed', myAccount.following);

        return res.status(200).json({ following: myAccount.following });

    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'An error occurred while (un)following!' });
    }
}

const logout = (req, res) => {
    //removes user's session, called on logout so
    //server knows theyre no longer logged in
    req.session.destroy();
    return res.redirect('/');
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }
        //adds new var called 'account'
        //attaching all fields from toAPI to their session for tracking
        req.session.account = Account.toAPI(account);
        return res.json({ redirect: '/maker' });
    })

};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/maker' });

    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: 'An error occurred!' });
    }
};

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    moreUsersPage,
    getUsers,
    getSelf,
    controlFollow
}