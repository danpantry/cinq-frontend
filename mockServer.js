const express = require('express');
const jsonServer = require('json-server');

const app = express();

app.get('/auth/login', (_, res) => {
    res.json({
        // Force username and password authentication
        state: 'auth.login'
    });
});

app.use(
    jsonServer.create().use(jsonServer.router('db.json'), jsonServer.defaults())
);

app.listen(8080);
