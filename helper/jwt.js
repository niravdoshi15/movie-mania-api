const expressJwt = require('express-jwt');

module.exports = jwt;

function jwt() {
    const secret= process.env.SECRET || 'BHDWIRDLE'
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/login',
            '/api',
            '/api/search',
            '/api/update/:id',
            '/api/genres'
            
        ]
    });
}