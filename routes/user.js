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
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    mensagem: 'USUÁRIO INSERIDO COM SUCESSO',
                    NovoUsuario: {
                        id_user: result.id_user,
                        nome: req.body.nmUser,
                        email: req.body.emailUser,
                        request:{
                            tipo: 'GET',
                            descricao:'Retornar todo os usuários',
                            url: 'http://localhost:3000/user'
                        }
                    }
                }
               return res.status(201).send(response);
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
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    quantidade: result.length,
                    Usuario: result.map(todosUser => {
                        return {
                            nome: todosUser.nm_user,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retornar os detalhes de um usuário especifico',
                                url: 'http://localhost:3000/user/' + todosUser.id_user
                            }
                        }
                    })
                }
                return res.status(201).send({ response })
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
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }); }

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado usuário com essa id'
                    })
                }
                const response = {
                    usuario: {
                        id_user: result[0].id_user,
                        nome: result[0].nm_user,
                        email: result[0].email_user,
                        request:{
                            tipo: 'GET',
                            descricao:'Retorna todo os usuários',
                            url: 'http://localhost:3000/user'
                        }
                    }
                }
               return res.status(200).send(response);
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
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    mensagem: 'USUÁRIO ATUALIZADO COM SUCESSO',
                    usuario: {
                        id_user: req.body.id_user,
                        nome: req.body.nmUser,
                        email: req.body.emailUser,
                        request:{
                            tipo: 'GET',
                            descricao:'Retornar os detalhes de um usuários',
                            url: 'http://localhost:3000/user/' + req.body.id_user
                        }
                    }
                }
               return res.status(202).send(response);
            }
        )
    });
});

//DELETA UM USER PELA ID
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `DELETE FROM user WHERE id_user = ?`,
            [req.body.id_user],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    mensagem: 'USUÁRIO DELETADO',
                    request: {
                        tipo: 'POST',
                        descricao: 'Inserir um novo usuario',
                        url: 'http://localhost:3000/user',
                        body:{
                            nm_user: 'String',
                            email_user: 'String',
                            senha_user: 'String'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;
