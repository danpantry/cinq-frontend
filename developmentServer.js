const express = require('express');
const Bundler = require('parcel-bundler');
const app = express();
const jwt = require('jsonwebtoken');
const jsonServer = require('json-server');

const api = jsonServer.create();
api.use(jsonServer.router('db.json'));
api.use(jsonServer.defaults());
app.use('/api/v1', api);

// Authentication

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
        roles: ['Admin', 'User']
    };
    const authToken = jwt.sign(payload, JWT_SECRET);

    res.json({
        authToken,
        csrfToken: 'csrfToken'
    });
});

// Parcel - This handles app compilation and watching.

const bundler = new Bundler('source/html/index.html');
app.use(bundler.middleware());

app.listen(8080);
