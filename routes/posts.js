const express = require('express')
const router = express.Router();


//RETORNAR TODOS OS POST
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'RETORNAR OS POST'
    });
});

//CRIA UM NOVO POST
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'POST PUBLICADO'
    });
});

//RETORNAR UM POST ESPECIFICO
router.get('/:id_pedidos', (req, res, next) => {
    const id = req.params.id_pedidos;
    res.status(200).send({
        mensagem: 'DETALHES DO POST',
        id: id
    });
});

//DELETA O POST
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'POST EXCLUÍDO'
    })
});

module.exports = router;
