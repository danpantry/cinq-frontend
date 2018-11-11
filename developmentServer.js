const express = require('express');
const Bundler = require('parcel-bundler');
const app = express();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'nodejs in current year';

app.get('/auth/login', (_, res) => {
    res.json({
        // Force username and password authentication
        state: 'auth.login'
    });
});

app.post('/auth/local/login', (_, res) => {
    // Allow pass-through authentication for now
    const payload = {
        roles: []
    };
    const authToken = jwt.sign(payload, JWT_SECRET);

    res.json({
        authToken,
        csrfToken: 'csrfToken'
    });
});

const staticMetadata = {
    accounts: [],
    accountTypes: [],
    regions: [],
    notifiers: [],
    menuItems: {},
    currentUser: {
        username: 'cinq test user'
    },
    resourceTypes: {}
};

app.use('/api/v1/metadata', (_, res) => res.json(staticMetadata));

const bundler = new Bundler('source/html/index.html');
app.use(bundler.middleware());

app.listen(8080);
