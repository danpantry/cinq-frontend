const express = require('express');
const Bundler = require('parcel-bundler');
const app = express();
const jwt = require('jsonwebtoken');

// copied from https://github.com/RiotGames/cloud-inquisitor/blob/master/backend/cloud_inquisitor/constants.py
const ROLE_USER = 'User';
const ROLE_ADMIN = 'Admin';
const staticMetadata = {
    accounts: [],
    accountTypes: [],
    regions: [],
    notifiers: [],
    // In the original backend, these are sourced from various plugins.
    // For our purposes, we're going to switch all of these plugins on
    menuItems: {
        default: {
            order: 10,
            name: undefined,
            required_role: ROLE_USER,
            items: [
                {
                    name: 'Dashboard',
                    state: 'dashboard',
                    order: 10
                }
            ]
        },
        browse: {
            order: 20,
            name: 'Browse',
            required_role: ROLE_USER,
            items: [
                {
                    name: 'Search',
                    state: 'search',
                    args: {
                        page: 1,
                        partial: undefined,
                        keywords: undefined,
                        accounts: undefined,
                        regions: undefined,
                        resourceTypes: undefined
                    },
                    order: 10
                }
            ]
        },
        reports: {
            order: 30,
            name: 'Reports',
            required_role: ROLE_USER,
            items: []
        },
        admin: {
            order: 99,
            name: 'Admin',
            required_role: ROLE_ADMIN,
            items: [
                {
                    name: 'Accounts',
                    state: 'account.list',
                    order: 1
                },
                {
                    name: 'Config',
                    state: 'config.list',
                    order: 2
                },
                {
                    name: 'Users',
                    state: 'user.list',
                    order: 3,
                    args: {
                        page: 1,
                        count: 50,
                        authSystem: undefined
                    }
                },
                {
                    name: 'Roles',
                    state: 'role.list',
                    args: {
                        page: 1,
                        count: 25
                    },
                    order: 4
                },
                {
                    name: 'Templates',
                    state: 'template.list',
                    order: 4
                },
                {
                    name: 'Emails',
                    state: 'email.list',
                    args: {
                        page: 1,
                        count: 100,
                        subsystem: undefined
                    },
                    order: 70
                },
                {
                    name: 'Audit Log',
                    state: 'auditlog.list',
                    args: {
                        page: 1,
                        count: 100,
                        events: [],
                        actors: []
                    },
                    order: 80
                },
                {
                    name: 'Logs',
                    state: 'log.list',
                    args: {
                        page: 1,
                        count: 100,
                        levelno: undefined
                    },
                    order: 90
                }
            ]
        }
    },
    currentUser: {
        username: 'cinq test user'
    },
    resourceTypes: {}
};

app.use('/api/v1/metadata', (_, res) => res.json(staticMetadata));

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
        roles: [ROLE_ADMIN, ROLE_USER]
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
