
<h1 align="center">
    Atividade 1
</h1>
<h3 align="center">
    Criação de uma API RESTful simples
</h3>
Descrição: Criar uma API RESTful básica usando a linguagem de programação de sua escolha. A API deve permitir a criação, leitura, atualização e exclusão de recursos. A API deve incluir os seguintes recursos:

- Um recurso para gerenciamento de usuários, com os campos: ID, nome, e-mail e senha.
- Um recurso para gerenciamento de posts, com os campos: ID, título, conteúdo, autor e data de criação.

Deve-se seguir as melhores práticas para a criação de APIs RESTful, incluindo o uso correto dos verbos HTTP (GET, POST, PUT, DELETE) e a definição clara dos endpoints para cada recurso. A API deve ser documentada de acordo com as melhores práticas, usando uma especificação de API, como o OpenAPI ou o Swagger.
Nesta primeira atividade não é necessário criar uma interface gráfica para visualização, deve-se incluir testes unitários e testes de integração para a API, usando uma ferramenta de teste, como o Postman ou o Newman.
Preferencialmente utilizar a linguagem Node.JS. Se utilizar outra, justifique o porquê.

<h4> Critérios de avaliação: </h4>

- Correção e funcionalidade da API criada.
- Adesão às melhores práticas para a criação de APIs RESTful, incluindo o uso correto dos verbos HTTP e a definição clara dos endpoints para cada recurso.
- Documentação clara e concisa da API, de acordo com as melhores práticas de documentação de APIs.
- Inclusão de testes unitários e testes de integração para a API, usando uma ferramenta de teste adequada.
- Qualidade geral do código, incluindo legibilidade, modularidade, segurança, comentários e replicabilidade.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Torfresma Simples API

Essa é uma api, simples para gerenciamento de usuarios e posts

## Instalação
Com o Node JS já instalado e configurado

1. Clone o repositório: 
git clone https://github.com/AndreiDaSilva/Torfresma.git

2. Instale as dependências:
cd Torfresma
npm install

4. Configuração:

- Configure o banco de dados e crie as tabelas conforme o arquivo 
SQL>DataBase.sql

## Uso

Aplicação pode ser utilizado atráves de softwares de requições com Isonnia ou Postman

npm start 

Abra seu navegador e acesse localhost:3000/api-docs para visualizar a documentação da API.





 

