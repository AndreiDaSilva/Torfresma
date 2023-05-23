const express = require('express');
const moment = require('moment');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');

//RETORNAR TODOS OS POST
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `SELECT post.id_post,
                    post.titulo_post,
                    post.cont_post,
                    post.dt_post,
                    user.nm_user,
                    user.id_user,
                    user.email_user
                FROM post
          INNER JOIN user 
                  ON post.user_id = user.id_user;`,
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    quantidade: result.length,
                    posts: result.map(post => {
                        return {
                            id_post: post.id_post,
                            titulo: post.titulo_post,
                            conteudo: post.cont_post,
                            data: post.dt_post,
                            autor: {
                                id_user: post.user_id,
                                nome: post.nm_user,
                                email: post.email_user
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retornar os detalhes de um post especifico',
                                url: 'http://localhost:3000/post/' + post.id_user
                            }
                        }
                    })
                }
                return res.status(201).send({ response })
            }
        )
    });
});

//CRIA UM NOVO POST
router.post('/', login.obrigatorio, (req, res, next) => {
    const data = moment().format('YYYY-MM-DD');
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO post (user_id, titulo_post, cont_post, dt_post, autor_post) VALUES (?,?,?,?,?)',
            [
                req.user.id_user,
                req.body.titulo,
                req.body.descricao,
                data,
                req.user.nome
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    mensagem: 'POST CRIADO COM SUCESSO',
                    NovoPost: {
                        id_post: result.id_post,
                        id_user: req.body.id_user,
                        titulo: req.body.titulo,
                        conteudo: req.body.descricao,
                        data: data,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retornar todo os post',
                            url: 'http://localhost:3000/post'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    }

    )
});


//RETORNAR UM POST ESPECIFICO
router.get('/:id_post', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            'SELECT * FROM post WHERE id_post = ?;',
            [req.params.id_post],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado post nesse usuario'
                    })
                }
                const response = {
                    post: {
                        id_post: result[0].id_post,
                        id_user: result[0].user_id,
                        titulo: result[0].titulo_post,
                        descricao: result[0].desc_post,
                        data: result[0].dt_post,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todo os post',
                            url: 'http://localhost:3000/user'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});

//RETORNAR TODOS POST DO USUARIO
router.get('/user/:id_user', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            'SELECT * FROM post WHERE user_id = ?;',
            [req.params.id_user],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado post com essa id'
                    })
                }
                const response = {
                    quantidade: result.length,
                    posts: result.map(post => {
                        return {
                            id_post: post.id_post,
                            id_user: post.user_id,
                            titulo: post.titulo_post,
                            conteudo: post.cont_post,
                            data: post.dt_post,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retornar os detalhes de um post especifico',
                                url: 'http://localhost:3000/post/' + post.id_user
                            }
                        }
                    })
                }
                return res.status(201).send({ response })
            }
        )
    });
});

//DELETA O POST
router.delete('/', login.obrigatorio, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `DELETE FROM post WHERE id_post = ?`,
            [req.body.id_post],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    mensagem: 'POST DELETADO',
                    request: {
                        tipo: 'POST',
                        descricao: 'Inserir um novo post',
                        url: 'http://localhost:3000/post',
                        body: {
                            id_user: 'String',
                            titulo: 'String',
                            descricao: 'String',
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

router.put('/', login.obrigatorio, (req, res, next) => {
    const data = moment().format('YYYY-MM-DD');
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `UPDATE post
            SET titulo_post = ?,
                cont_post = ?,
                dt_post = ?
            WHERE id_post = ?`,
            [
                req.body.titulo,
                req.body.descricao,
                data,
                req.body.id_post
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                const response = {
                    mensagem: 'POST ATUALIZADO COM SUCESSO',
                    post: {
                        id_user: req.user.id_user,
                        id_post: req.body.id_post,
                        titulo: req.body.titulo,
                        descricao: req.body.descricao,
                        data: data,
                        autor: req.user.nome,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retornar os detalhes de um usuários',
                            url: 'http://localhost:3000/user/' + req.user.id_user
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;
