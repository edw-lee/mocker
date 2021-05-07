const express = require('express');
const User = require('../models/User');
const {readdir} = require('fs').promises;
const path = require('path');
const { resolve } = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Mocker Backend!');
});

//This is called when user login, it will create a new user in the database if it does not exist
//This does not set the login session of the user, that is handled by Google API
router.post('/login', (req, res) => {
    const { user } = req.body;
    const name = user.name;
    const email = user.emailAddress;

    if (user) {
        User.findOne({ email }, (error, findUser) => {
            if (error) return res.status(500).json({ error });

            if (!findUser) {
                User.create({ name: user.displayName, email: user.emailAddress }, (error, createUser) => {
                    if (error) return res.status(500).json(error);

                    if (createUser) {
                        req.session.user = { name, email }
                        res.status(201).send();
                    }
                    else
                        res.status(500).send({ error: 'Failed to create user.' });
                })
            }
        });
    } else {
        res.status(422).json({ error: 'User object not found.' });
    }

});

router.get('/readpublicdir', (req, res) => {
    let { dir } = req.query;
    dir = path.join(__dirname, `../../mocker-frontend/public/${dir}`);    

    if (dir) {
        const getFiles = async (_dir) => {        
            const results = await readdir(_dir, { withFileTypes: true });            
            const files = await Promise.all(results.map(result => {
                const newPath = resolve(_dir, result.name);
                return result.isDirectory() ? getFiles(newPath) : newPath.replace(`${dir}/`, '');//Remove the start of the full directory path
            }));            

            return files.flat();
        }

        getFiles(dir)
            .then(files => res.send({ files }))
            .catch(error => res.status(500).send(error));
    }
});

module.exports = router;