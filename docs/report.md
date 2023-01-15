# **_Chelas Movies Database_**
![cmdb/screenshot](https://github.com/isel-leic-ipw/cmdb-ipw-leic2223i-ipw31n-g01/blob/main/docs/images/cmdb.png)

Turma LEIC31N - Grupo 1

Alunos:  
Nuno Venâncio    n.º 45824  
Miguel Queluz    n.º 45837  
Darlene Horta    n.º 47813


Docente:  
Professor Luís Falcão

15 de janeiro de 2023

## Introdução

Este trabalho foi-nos proposto, no âmbito da disciplina de Introdução à Programação Web (IPW), a criação de uma base de dados de filmes, Chelas Movies Database (CMDB), num web site criado através da linguagem de JavaScript, html e http. 
Este projeto foi construído em três fases, que nos levariam a passar por todas as fases da criação de uma aplicação web, ou seja, conhecermos e desenvolvermos a CMDB de raiz. Primeiramente, foi criada a aplicação internamente, onde iriamos ter todos os módulos necessários para a comunicação interna, cmdb-server, cmdb-web-api, cmdb-services, imdb-movies-data, cmdb-data-mem, posteriormente fazer a interligação da API do IMDB à nossa aplicação, neste caso os 250 melhores filmes, bem como colocar uma barra de pesquisa, para procurar filmes pelo seu nome, e conseguir fazer a gestão da criação de grupos, podendo editá-los, listá-los, removê-los, adicionar filmes pretendidos aos grupos previamente criados, e obter detalhes dos grupos, com descrição, duração total dos filmes que estariam inseridos nesse grupo. 
Por fim, o objetivo passou por fazer a interligação do servidor interno com a web API, a aplicação teria a possibilidade de ser acedida por utilizadores, que após estarem registados e devidamente autenticados, com os métodos GET, POST, PUT e DELETE poderiam gerir através da interface web, a sua base de dados de grupos de filmes.



## Estrutura da aplicação
### Componente do cliente (web-site):
Na apresentação da aplicação ao cliente, a estrutura é uma aplicação web na qual é necessário efetuar registo / autenticação para ter acesso às componetes de criar listas de filmes, adicionar filmes às mesmas e toda a gestão quer das listas quer dos filmes.

A página inicial do web site ('/') redireciona o utilizador para a página inicial da aplicação propriamente dita ('/cmdb/), sendo que aqui apenas é possível efutar o registo e o login.

Depois de autorizado, o utilizador pode criar / editar / apagar listas de filmes (grupos), às quais é possível adicionar filmes.

Estas listas de filmes mostram o título, a descrição, o número de filmes adicionados e o tempo em minutos da totalidade dos filmes.

Para adicionar filmes a listas o utilizador utiliza um form de pesquisa, sendo que do resultado da mesma, em cada filme, está uma lista dropdown dos grupos aos quais é possível adicionar o filme pretendido.

Na figura abaixo é possível visualizar a extrutura da aplicação disponível ao cliente

![client_structure](https://github.com/isel-leic-ipw/cmdb-ipw-leic2223i-ipw31n-g01/blob/main/docs/images/client.jpeg)  
Figura 1 - Esquema estrutura da aplicação do lado clientes


### Extrutura da aplicação:

Esta aplicação foi desenvolvida em nodeJS, fazendo uso do Express (web server), Handlebars (view engine), Passport (user authentication) e Elasticsearch (database)

A aplicação inicia no módulo CMDB-server este vai carregar os módulos utilizados, defenir constantes, usar middlewares e definir as rotas para uso da componente web-api e web-site.

A componente web, de manipulação e tratamento de pedidos e respostas HTTP, divide-se em duas subcomponentes principais,  web-api e web-site.
A web-api para tratar pedidos e gerar respostas relativos à APIm no formato JSON e a web-site para a mesma finalidade mas usando o formato HTTP para gerar as respostas. Nesta última, faszendo e uso do motor de vistas (view engine) Handlebars, temos também o modulo views, onde são feitas dinâmicamente, todas as páginas web de resposta ao cliente. Para a validação e obtenção de dados, tanto a componente web-api como a web-site se ligam por sua vez à componente services.

Este módulo cmdb-services, é onde se encontra toda a lógica e regras da aplicação, fazendo assim de ligação entre as componentes web e a componente data. É onde são analizados e filtrados os pedidos, e formatadas as respostas dos dados obtidos pela camada seguinte.

O último módulo, data, é composto por três submódulos lógicos, um utilizado anteriormente para o armazenamento e pesquisa de dados internos, na memoria, outro para lidar com chamadas http à API da webapp IMDB, e, nesta última fase um que utiliza a base de dados não relacional, Elasticsearch. Tanto o submódulo da mamoria interna bem como o do elastic search são ainda subdivididos em dados referentes a utilizadores e dados referentes a grupos de filmes de utilizadores.

![server_structure](https://github.com/isel-leic-ipw/cmdb-ipw-leic2223i-ipw31n-g01/blob/main/docs/images/server.jpg)  
Figura 2 - Esquema estrutura da aplicação do servidor

## Data Storage Design - ElasticSearch

Para a implementação da base de dados  _ElasticSearch,_  criámos o módulo elastic-http.mjs, este será responsável pela interação entre a base de dados e as nossas funções sendo assim implementadas neste mesmo funções que serão utilizadas pelos modulos cmdb-groups-data-elastic.mjs e cmdb-user- data-elastic.mjs. Estes, ao importarem o modulo elastic-http.mjs devem passar o nome do indice (“groups” ou “users”) ao qual queremos aceder através da base de dados.

Nota: todos os objetos criados pelo elasticSearch inicializam se sempre com o seguinte caracter “_” acompanhado com o nome do respetivo objeto, em JSON. Os objectos que iremos inserir/atualizar/apagar encontram se no seguinte array data.hits.hits , em que data representa o objeto retornado da base de dados, este tem uma propriedade com o nome hits que é um objeto que contem uma propriedade também de nome hits que é um array de objetos, através deste array conseguimos aceder a propriedade “_source” onde estará guardada a informação pretendida.


## Instruções de instalação e execução da aplicação

**Dependências - Modulos usados**
cookie-parser - análise e manipulação de cookies
cors - prevenção de ataques por Cross Origin Resource Sharing
crypto - biblioteca de criptografia para geração de números 
express - framework web, server
express-session - para manipular sessões
hbs - handlebars, motor de vistas (view engine)
mocha - testes
morgan - visualização de pedidos HTTP e códigos de resposta em modo de desenvolvimento
node-fetch - para efetuar pedidos HTTP
nodemon - para monitorizar alterações no código quando a app se encontra em desenvolvimento
open-api - definição da API em YAML
passport - autenticação
passport-local - autenticação local
serve-favicon - mostra favicon na página web
session-file-store - guarda em ficheiro dados relativos ás sessões
swagger - visualização da API
swagger-ui-express - visualização da API
yamljs - suporte a YAML

**Configuração do Elasticsearch**
É necessário ter o elasticsearch instalado e configurado para correr a aplicação.
Para tal, escolher o instalador para a plataforma pretendida em https://www.elastic.co/downloads/elasticsearch
Depois de instalado é necessário editar o ficheiro elasticsearch.yml, onde diz:
```yml
# Enable security features
xpack.security.enabled: true
```
escrever:
```yml
# Enable security features
xpack.security.enabled: false
```

Para a criação dos indexes user e groups é utilizado o Postman (http://postman.com), onde são efetucados:
PUT http://localhost:9200/users
PUT http://localhost:9200/groups


**Para executar a aplicação**
```bash
npm install
```
comando que instalará todos os módulos de que a aplicação depende, seguido de
```bash
node cmdb-server.mjs
```
A aplicação será acecível num browser ou outro cliente HTTP em [http://localhost:3000/](http://localhost:3000)

## Conclusão

Após a realização do CMDB, sentimos que a mesma contém todas as funções básicas necessárias à implementação desejada pelo professor, no entanto por falta de tempo, não conseguimos implementar os testes unitários, o que poderá ser uma proposta para uma futura melhoria desta aplicação. 
Sentimos que o projeto foi um desafio gratificante, que contribuiu bastante para o desenvolvimento das nossas capacidades de programação numa nova linguagem. 


## YAML – Server API Documentation
```yaml
openapi: 3.0.1
info:
  title: CMDB API
  description: API for Chelas Movie Data Base
  contact:
    email: a45824@alunos.isel.pt #a45837@alunos.isel.pt, a47813@alunos.isel.pt
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
  version: 1.0.0
servers:
  - description: Localhost server for testing API
    url: http://localhost:3000

tags:
- name: users   # user name
- name: groups  # define groups
- name: search  # search movies: top250 or by name 

paths:
  /users:
    post:
      tags:
      - users
      summary: adds a user
      description: Adds a user to the system
      operationId: addUser
      requestBody:
        description: User to add
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewUser'
        required: false
      responses:
        201:
          description: user created
          content: 
            application/json:
              schema:
                $ref: '#/components/schemas/NewGroupCreated'
        400:
          description: Invalid input, object invalid
          content: {}
      x-codegen-request-body-name: user
  /groups:
    get:
      tags:
      - groups
      summary: get groups
      description: By passing in the appropriate options, you can search for available
        groups
      operationId: getGroups
      security:
        - bearerAuth: []
      parameters:
      - name: Authorization
        in: header
        required: false
        schema:
          type: string
          format: uuid
      - name: q
        in: query
        description: pass an optional search string for looking up groups with that text
        schema:
          type: string
      - name: skip
        in: query
        description: number of records to skip for pagination
        schema:
          minimum: 0
          type: integer
      - name: limit
        in: query
        description: maximum number of records to return
        schema:
          maximum: 50
          minimum: 0
          type: integer
      responses:
        200:
          description: search results matching criteria
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Group'
        400:
          description: bad input parameter
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/InvalidRequest'
        404:
          description: not found 
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/NotFound'
    post:
      tags:
      - groups
      summary: adds a group
      description: Adds a group of a user to the system
      operationId: addGroup
      security:
        - bearerAuth: []
      parameters:
      - name: Authorization
        in: header
        required: true
        schema:
          type: string
          format: uuid
      requestBody:
        description: Group to add
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewGroup'
        required: false
      responses:
        201:
          description: Group created
          content: 
            application/json:
              schema:
                $ref: '#/components/schemas/NewGroupCreated'
        400:
          description: Invalid input, object invalid
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/NewGroup'
      x-codegen-request-body-name: group
  /groups/{groupId}:
    get:
      tags:
      - groups
      summary: Get a group given its id
      description: Get a group given its id
      operationId: getGroupById
      security:
        - bearerAuth: []
      parameters:
      - name: Authorization
        in: header
        schema:
          type: string
          format: uuid
      - name: groupId
        in: path
        description: ID of group that to be fetched
        required: true
        schema:
          type: integer
          minimum: 1
      responses:
        200:
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Group'
        400:
          description: Invalid ID supplied
          content: 
            application/json:
              schema: 
                $ref: '#/components/schemas/InvalidRequest'
        404:
          description: Group not found
          content: 
            application/json:
              schema: 
                $ref: '#/components/schemas/NotFound'
    put:
      tags:
      - groups
      summary: updates a group
      description: Updates a Group in the system
      operationId: updateGroup
      security:
        - bearerAuth: []
      parameters:
      - name: Authorization
        in: header
        required: true
        schema:
          type: string
          format: uuid
      - name: GroupId
        in: path
        description: ID of the group to be updated
        required: true
        schema:
          type: integer
      requestBody:
        description: Group to update
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewGroup'
        required: false
      responses:
        201:
          description: group updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Group'
        400:
          description: Invalid ID supplied
          content: 
            application/json:
              schema: 
                $ref: '#/components/schemas/InvalidRequest'
        404:
          description: Group not found
          content: 
            application/json:
              schema: 
                $ref: '#/components/schemas/NotFound'
      x-codegen-request-body-name: group
    delete:
      tags:
      - groups
      summary: Delete a group by ID
      description: Delete a group by ID
      operationId: deleteGroup
      security:
        - bearerAuth: []
      parameters:
      - name: groupId
        in: path
        description: ID of the group to be deleted
        required: true
        schema:
          type: integer
      responses:
        200: 
          description: Group deleted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Group'
        400:
          description: Invalid ID supplied
          content: 
            application/json:
              schema: 
                $ref: '#/components/schemas/InvalidRequest'
        404:
          description: Group not found
          content: 
            application/json:
              schema: 
                $ref: '#/components/schemas/NotFound'
  /search:
    get:
      tags:
      - search
      summary: get movies
      description: By passing in the appropriate options, you can search for available
        movies
      operationId: getMovies
      security:
        - bearerAuth: []
      parameters:
      - name: Authorization
        in: header
        required: false
        schema:
          type: string
          format: uuid
      - name: q
        in: query
        description: pass an optional search string for looking up movies with that title
        schema:
          type: string
      - name: skip
        in: query
        description: number of records to skip for pagination
        schema:
          minimum: 0
          type: integer
      - name: limit
        in: query
        description: maximum number of records to return
        schema:
          maximum: 250
          minimum: 0
          type: integer
      responses:
        200:
          description: search results matching criteria
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Search'
        400:
          description: bad input parameter
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/InvalidRequest'
        404:
          description: Movie not found
          content: 
            application/json:
              schema: 
                $ref: '#/components/schemas/NotFound'
  /groups/{groupId}{movieId}:
    put:
      tags:
      - movies
      summary: adds a movie to a group
      description: Adds a movie to a group of a user to the system
      operationId: addMovie
      security:
        - bearerAuth: []
      parameters:
      - name: Authorization
        in: header
        required: true
        schema:
          type: string
          format: uuid
      - name: groupId
        in: path
        description: ID of group that to be fetched
        required: true
        schema:
          type: integer
          minimum: 1
      - name: movieId
        in: path
        description: ID of group that to be fetched
        required: true
        schema:
          type: integer
          minimum: 1
      responses:
        201:
          description: Movie added
          content: 
            application/json:
              schema:
                $ref: '#/components/schemas/NewMovieAdded'
        400:
          description: Invalid input, object invalid
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/InvalidRequest'
      x-codegen-request-body-name: group
    delete:
      tags:
      - movies
      summary: Delete a movie from a group by ID
      description: Delete a movie by ID
      operationId: deleteMovie
      security:
        - bearerAuth: []
      parameters:
      - name: groupId
        in: path
        description: ID of the group that contains the movie to delete
        required: true
        schema:
          type: integer
      - name: movieId
        in: path
        description: ID of the movie to delete
        required: true
        schema:
          type: integer
      responses:
        200: 
          description: Movie deleted
          content: 
            application/json:
              example:
                { status: "group with id 123 deleted" } 
        400:
          description: Invalid ID supplied
          content: {}
        404:
          description: Movie not found
          content: {}  
components:
  securitySchemes:
    bearerAuth:            # arbitrary name for the security scheme
      type: http
      scheme: bearer
  schemas:
    Group:
      required:
      - id
      - title
      - description
      - userId
      - totalDuration
      - numMovies
      - movies
      type: object
      properties:
        id:
          type: integer
          example: 1
        title:
          type: string
          example: Western
        description:
          type: string
          example: playlist of western movies
        userId:
          type: integer
        numMovies:
          type: integer
        totalDuration:
          type: integer
        movies:
          type: object
          properties:
            name:
              type: string
              example: The Good, the Bad and the Ugly (1966)
            duration:
              type: integer
              example: 90
    NewGroup:
      required:
      - title
      - description
      - userId
      type: object
      properties:
        title:
          type: string
          example: Western
        description:
          type: string
          example: playlist of western movies
        userId:
          type: integer
    NewUser:
      required:
      - userName
      type: object
      properties:
        userName:
          type: string
          example: joao
    NewUserCreated:
      required:
        - status
        - user
      type: object
      properties:
        status:
          type: string
          example: User with name joao created with success
        user:
          $ref: '#/components/schemas/NewUser'
    NewGroupCreated:
      required:
        - status
        - group
      type: object
      properties:
        status:
          type: string
          example: Group with id 123 created with success
        group:
          $ref: '#/components/schemas/Group'
    InvalidRequest:
      type: object
      properties:
        error:
          type: string
          example: "Missing required parameters"
    NotFound:
      type: object
      properties:
        error:
          type: string
          example: "Not found"
    Search:
      required:
        - name
        - top250
      type: object
      properties:
        name:
          type: string
          example: The Good, the Bad and the Ugly (1966)
        top250:
          type: integer
    Movies:
      required:
        - userId
        - groupId
        - id
        - name
        - duration
    NewMovieAdded:
      required:
        - status
        - group
        - movie
      type: object
      properties:
        status:
          type: string
          example: Movie with id 123 added with success
        group:
          $ref: '#/components/schemas/Group'
        movie:
          type: object
          properties:
            id:
              type: integer
              example: 3524549
            name:
              type: string
              example: The Good, the Bad and the Ugly (1966)
            duration:
              type: integer
              example: 90
```
