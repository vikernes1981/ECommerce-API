const cors = require('cors');

const someMiddleware = (req, res, next) => {
   
    next();
};

module.exports = { someMiddleware, cors };
