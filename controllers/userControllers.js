const mysql = require('../models/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.getUsers = (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `SELECT user.id_user,
                    user.nm_user,
                    user.email_user
               FROM user;`,
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    users: result.map(user => {
                        return {
                            id_user: user.id_user,
                            nome: user.nm_user,
                            email: user.email_user,
                        }
                    })
                }
                return res.status(201).json(response)
            });
    });
};

exports.getUserId = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            'SELECT * FROM user WHERE id_user = ?;',
            [req.params.id_user],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado user nesse id'
                    })
                }
                const response = {
                    post: {
                        id_user: result[0].id_user,
                        nome: result[0].nm_user,
                        email: result[0].email_user,
                    }
                }
                return res.status(200).json(response);
            });
    });
}

exports.postNewUser = (req, res, next) => {
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
                                    email: req.body.email,
                                }
                            }
                            return res.status(201).json(response);
                        });
                });
            }
        });
    });
}

exports.postLoginUser = (req, res, next) => {
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
                    return res.status(200).json({
                        mensagem: 'USUÁRIO AUTENTICADO COM SUCESSO',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'FALHA NA AUTENTICAÇÃO, EMAIL OU SENHA INCORRETO' });
            });
        });
    });
}

exports.deleteUser = (req, res, next) => {
    console.log(req.user);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `DELETE FROM user WHERE id_user = ?;`,
            [req.user.id_user],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }

                const response = {
                    mensagem: 'USUÁRIO DELETADO'
                }
                return res.status(202).json(response);
            });
    });
};

exports.putUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `UPDATE user
            SET nm_user = ?,
                email_user = ?,
                senha_user = ?
            WHERE id_user = ?`,
            [
                req.body.nome,
                req.body.email,
                req.body.senha,
                req.user.id_user
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    mensagem: 'USUÁRIO ATUALIZADO COM SUCESSO',
                    Usuario_Alterado: {
                        id_user: req.user.id_user,
                        nome: req.body.nome,
                        email: req.body.email,
                    }
                }
                return res.status(202).json(response);
            });
    });
}
