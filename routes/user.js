const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;


//INSERE UM NOVO USER
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            'INSERT INTO user (nm_user, email_user, senha_user) VALUES (?,?,?)',
            [req.body.nmUser, req.body.emailUser, req.body.senhaUser],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                res.status(201).send({
                    mensagem: 'USUÁRIO INSERIDO COM SUCESSO',
                    id_user: resultado.insertId
                });
            }
        )
    });
});

//RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            'SELECT * FROM user;',
            (error, resultado, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                return res.status(201).send({ response: resultado })
            }
        )
    });
});


router.get('/:id_user', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            'SELECT * FROM user WHERE id_user = ?;',
            [req.params.id_user],
            (error, resultado, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                return res.status(201).send({ response: resultado })
            }
        )
    });
});

//ALTERA UM PRODUTO
router.put('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `UPDATE user
            SET nm_user = ?,
                email_user = ?,
                senha_user = ?
            WHERE id_user = ?`,
            [
                req.body.nmUser,
                req.body.emailUser,
                req.body.newSenha,
                req.body.id_user
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                res.status(201).send({
                    mensagem: 'USUÁRIO ALTERADO COM SUCESSO ',
                    id_user: resultado.insertId
                });
            }
        )
    });
});

//DELETA UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'USUÁRIO DELETADO'
    })
});

module.exports = router;
