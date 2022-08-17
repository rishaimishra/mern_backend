var  {expressjwt} = require("express-jwt");

function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        // isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categorys(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })

}

// async function isRevoked(req, payload, done){
//     if (!payload.isAdmin) {
//         done();
//     }

//     done(null, true)

// }

module.exports = authJwt;