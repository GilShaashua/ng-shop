const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;

    return jwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            {
                url: /\/api\/v1\/orders(.*)/,
                methods: ['POST', 'OPTIONS'],
            },
            `${api}/users/login`,
            /\/api\/v1\/users\/fast-login(.*)/,
            `${api}/users`,
            `${api}/users/register`,
        ],
    });
}

async function isRevoked(req, token) {
    if (JSON.parse(req.query.isLoginFast)) {
        return false;
    }

    if (!token.payload.isAdmin) {
        return true;
    }
    return false;
}

module.exports = authJwt;
