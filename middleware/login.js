const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({ mensagem: 'FALHA NA AUTENTICAÇÃO' })
    }
}

exports.opcional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decode;
        next();
    } catch (error) {
        next();
    }
}