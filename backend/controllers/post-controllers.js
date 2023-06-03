const moment = require('moment');
const mysql = require('../mysql').pool;

exports.getPosts = (req, res, next) => {
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
                conn.release();
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
                                tipo: 'POST',
                                descricao: 'Criar um post',
                                url: 'http://localhost:3000/post/',
                                body: {
                                    titulo: 'String',
                                    descricao: 'String',
                                }
                            }
                        }
                    })
                }
                return res.status(201).send({ response })
            });
    });
};

exports.getPostId = (req, res, next) => {
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
                 ON post.user_id = user.id_user
              WHERE id_post = ?;`,
            [req.params.id_post],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado post nesse id'
                    })
                }
                const response = {
                    Posts: {
                        id_post: result[0].id_post,
                        titulo: result[0].titulo_post,
                        conteudo: result[0].cont_post,
                        data: result[0].dt_post,
                        autor: {
                            id_user: result[0].user_id,
                            nome: result[0].nm_user,
                            email: result[0].email_user
                        },
                        request: {
                            tipo: 'POST',
                            descricao: 'Criar um post',
                            url: 'http://localhost:3000/post/',
                            body: {
                                titulo: 'String',
                                descricao: 'String',
                            }
                        }
                    }
                }
                return res.status(200).send(response);
            });
    });
};

exports.getPostUser = (req, res, next) => {
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
                 ON post.user_id = user.id_user
              WHERE id_user = ?;`,
            [req.params.id_user],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado post com essa id'
                    })
                }
                const response = {
                    autor: {
                        id_user: result[0].user_id,
                        nome: result[0].nm_user,
                        email: result[0].email_user,
                    },
                    quantidade: result.length,
                    posts: result.map(post => {
                        return {
                            id_post: post.id_post,
                            titulo: post.titulo_post,
                            conteudo: post.cont_post,
                            data: post.dt_post,
                            request: {
                                tipo: 'POST',
                                descricao: 'Criar um post',
                                url: 'http://localhost:3000/post/',
                                body: {
                                    titulo: 'String',
                                    descricao: 'String',
                                }
                            }
                        }
                    })
                }
                return res.status(201).send({ response })
            });
    });
};

exports.postNewPost = (req, res, next) => {
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
                        autor: req.user.nome,
                        titulo: req.body.titulo,
                        conteudo: req.body.descricao,
                        data: data,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retornar todo os post',
                            url: 'http://localhost:3000/post',

                        }
                    }
                }
                return res.status(201).send(response);
            });
    });
};

exports.deletePost = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `DELETE FROM post WHERE user_id = ? AND id_post = ?`,
            [req.user.id_user, req.params.id_post],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                console.log(result)
                if(result.affectedRows === 0){
                    return res.status(402).send({
                        mensagem: 'NÃO AUTORIZADO'
                    });
                }
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

            });
    });
};

exports.putPost = (req, res, next) => {
    const data = moment().format('YYYY-MM-DD');
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }); }
        conn.query(
            `UPDATE post
            SET titulo_post = ?,
                cont_post = ?,
                dt_post = ?
            WHERE id_post = ? AND user_id = ?`,
            [
                req.body.titulo,
                req.body.descricao,
                data,
                req.params.id_post,
                req.user.id_user
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }); }
                if(result.affectedRows === 0){
                    return res.status(402).send({
                        mensagem: 'NÃO AUTORIZADO'
                    });
                }
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
            });
    });
}