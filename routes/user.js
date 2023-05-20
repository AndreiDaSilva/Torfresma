const express = require('express')
const router = express.Router();


//RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'TODOS OS USUÁRIOS'
    });
});

//INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'USUÁRIO CRIADO COM SUCESSO'
    });
});

//RETORNA UM PRODUTO ESPECIFICO PELA SUA ID
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    if(id === 'especial'){
        res.status(200).send({
            mensagem: id + ',' + ' VOCÊ É USUÁRIO ESPECIAL',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'USUÁRIO ' + id
        });
    }
});

//ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'USUÁRIO ALTERADO COM SUCESSO'
    });
});

//DELETA UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'USUÁRIO DELETADO'
    })
});

module.exports = router;
