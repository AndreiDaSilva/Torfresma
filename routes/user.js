const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//INSERE UM NOVO USER
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }); }
        conn.query(`SELECT * FROM user WHERE email_user = ?`, [req.body.email], (error, result) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (result.length > 0) {
                res.status(409).send({ mensagem: 'USUÁRIO JÁ CADASTRADO' });
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(`INSERT INTO user(nm_user, email_user, senha_user) VALUES (?,?,?)`,
                        [req.body.nome, req.body.email, hash],
                        (error, result) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error: error }) }
                            response = {
                                mensagem: 'USUÁRIO CRIADO COM SUCESSO',
                                NovoUsuario: {
                                    id_user: result.insertId,
                                    nome: req.body.nome,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send({ response });
                        });
                });
            }
        });
    });
});

//LOGIN DO USUARIO
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM user WHERE email_user = ?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'FALHA NA AUTENTICAÇÃO, EMAIL OU SENHA INCORRETO' });
            }
            bcrypt.compare(req.body.senha, results[0].senha_user, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'FALHA NA AUTENTICAÇÃO, EMAIL OU SENHA INCORRETO' });
                }
                if (result) {
                    const token = jwt.sign({
                        id_user: results[0].id_user,
                        nome: results[0].nm_user,
                        email: results[0].email_user
                    }, process.env.JWT_TOKEN,
                        {
                            expiresIn: "1h"
                        });
                    return res.status(200).send({
                        mensagem: 'USUÁRIO AUTENTICADO COM SUCESSO',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'FALHA NA AUTENTICAÇÃO, EMAIL OU SENHA INCORRETO' });
            });
        });
    });
});

module.exports = router;
