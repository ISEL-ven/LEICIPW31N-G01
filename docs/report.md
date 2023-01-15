# **_Chelas Movies Database_**
![cover](https://github.com/isel-leic-ipw/cmdb-ipw-leic2223i-ipw31d-g02/blob/main/docs/images_doc/cover.png)

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
### Componente do cliente:
Na apresentação da aplicação ao cliente, temos uma estrutura semelhante à apresentada na figura abaixo, sendo o cliente inicialmente redirecionado para uma página inicial não autenticada, sendo sempre redirecionado para esta sempre que tentar aceder a páginas autenticadas sem autenticação.

Nesta página inicial (_home_) o cliente tem a possibilidade de se autenticar, criando uma conta (_signup_) ou iniciando sessão (_login_), caso introduza dados inválidos é apresentado um erro para o notificar do acontecimento.

Tendo também a possibilidade de pesquisar filmes pelo nome do filme (_SearchMovie_) ou pelos no topo 250 (_top250_), conseguindo ver o detalhe dos filmes apresentados se os escolher.

Estando autenticado, o cliente é redirecionado para uma nova página inicial (_homeAuth_) onde terá uma abordagem mais personalizada, tendo agora as possibilidades de aceder aos seus grupos, pesquisar filmes por nome ou ver os do topo 250 assim como de fechar sessão (_logout_) sendo deste modo redirecionado para a página não autenticada.

Caso tente aceder aos grupos, é redirecionado para a página de grupos onde consegue ver os seus grupos caso os tenha, tendo a possibilidade de criar mais, tendo grupos, ao clicar neles consegue aceder a informação do grupo, nomeadamente, aos filmes e à duração total dos filmes, sendo cada filme possível de mostrar detalhes e de ser removido, tem também a capacidade de editar detalhes do grupo e de adicionar filmes (sendo que esta adição é feita através do primeiro filme que o sistema encontre com o nome fornecido).

![client_structure](https://github.com/isel-leic-ipw/cmdb-ipw-leic2223i-ipw31d-g02/blob/main/docs/images_doc/client_structure.jpg)  
Figura 1 - Esquema estrutura da aplicação para clientes

  
Para as pesquisas de filmes feitas através da página inicial autenticada, o procedimento é semelhante aquando de um cliente não autenticado sendo que no autenticado tem a possibilidade de adicionar filmes pesquisados a grupos existentes.


### Componente do servidor:

À semelhança da componente do cliente, a do servidor consiste na lógica por detrás dos módulos da aplicação, sendo assim apresentada na figura abaixo. A aplicação é iniciada através do módulo  CMDB-server que é o nosso ponto de entrada da aplicação este vai avaliar o que o cliente está a tentar fazer e caso estejamos a usar o nosso site, acede aos módulos  CMDB-users-site  (para informação relativa aos users) e  CMDB-web-site  para as restantes relativas ao nosso site, ambos estes trabalham a informação que recebem e são responsáveis por lidar com as respostas HTML deste modo recorre ao módulo  CMDB-services responsável pela lógica da nossa aplicação para obter a informação a devolver.

Por sua vez o módulo  CMDB-services, consoante os dados que necessita recorre ao módulo  Imdb-movies-data para informação relativa aos filmes e ao módulo data para informação relativa a grupos e usuários. No módulo data exitem duas implementações uma inicial (internal) que guarda a informação do site localmente e outra posterior (elastic) que consiste numa base de dados externa, de modo a não sobrecarregar o nosso programa, ambos estes módulos têm dois submódulos, um referente aos dados dos usuários e outro aos dados dos grupos.

![server_structure](https://github.com/isel-leic-ipw/cmdb-ipw-leic2223i-ipw31d-g02/blob/main/docs/images_doc/server_structure.jpg)  
Figura 2 - Esquema estrutura da aplicação do servidor

## Data Storage Design - ElasticSearch

Para a implementação da base de dados  _ElasticSearch,_  criámos o módulo elastic-http.mjs, este será responsável pela interação entre a base de dados e as nossas funções sendo assim implementadas neste mesmo funções que serão utilizadas pelos modulos cmdb-groups-data-elastic.mjs e cmdb-user- data-elastic.mjs. Estes, ao importarem o modulo elastic-http.mjs devem passar o nome do indice (“groups” ou “users”) ao qual queremos aceder através da base de dados.

Nota: todos os objetos criados pelo elasticSearch inicializam se sempre com o seguinte caracter “_” acompanhado com o nome do respetivo objeto, em JSON. Os objectos que iremos inserir/atualizar/apagar encontram se no seguinte array data.hits.hits , em que data representa o objeto retornado da base de dados, este tem uma propriedade com o nome hits que é um objeto que contem uma propriedade também de nome hits que é um array de objetos, através deste array conseguimos aceder a propriedade “_source” onde estará guardada a informação pretendida.

### Implementação

Passamos a explicar como é feita a implementação do modulo elastic-http.mjs

createIndice()->função que efetua um pedido PUT em que no seu uri contém o nome do índice passado pelo modulo que importou esta função;

CreateUpdateDocument(id,info) -> função que executa um pedido PUT em que recebe o id do documento e em info o conteudo que será inserido ou atualizado no respetivo documento.

GetAllDocuments()-> função que executa um pedido GET, retorna o conteúdo presente para o índice passado, podendo ser no nosso caso “users” ou “groups”.

getDocumentById(id) -> função que executa um pedido GET, retorna o conteúdo do id passado, podendo este representar o id do user ou do grupo

deleteDocument(id) -> função que executa um pedido DELETE para o respetivo documento com o id passado

GetCurrID()-> função que executa um pedido GET e retorna um objeto JSON com o qual, acedendo à propriedade hits (objeto), este tem a propriedade total que é também um objeto que tem a propriedade “value” cujo valor retornamos, este simboliza um id de users ou grupos

ExtractInfoFromElastic(data) -> função que recebe com parâmetro um objeto, que terá uma propriedade “hits” (objeto) que conterá uma outra propriedade “hits”, sendo esta um array de objetos, a função retorna este array.

Testes Unitários  
Relativamente a utilização e criação de testes criamos testes que estão a testar o modulo cmdb-services.mjs  
Em anexo encontrara o comando necessário para executar os mesmos

## Instruções de execução da aplicação

**Para executar a aplicação?**
Deverá ter instalado previamente o elasticSearch estando o mesmo a correr em paralelo numa janela da linha de comandos, caso contrário a aplicação não funcionará.

Caso não tenha instalado os módulos necessários para a execução da aplicação, deve instalar os módulos em falta, caso esteja a usar vscode basta executar no terminal referente ao ficheiro da aplicação os seguintes comandos, por ordem:

"npm install express express-handlebars yamljs cors cookie-parser express-session hbs node-fetch passport mocha "

Para iniciar a aplicação basta correr a instrução seguinte no terminal do ficheiro do módulo da aplicação:

"node cmdb-server.mjs".

Para aceder à aplicação através da web, basta na barra de pesquisas do navegador inserir: [http://localhost:1996/home](http://localhost:1996/home)  e conseguirá assim ter acesso e usar a nossa aplicação.


## Conclusão

Após a realização do CMDB, sentimos que a mesma contém todas as funções básicas necessárias à implementação desejada pelo professor, no entanto por falta de tempo, não conseguimos implementar os testes unitários, o que poderá ser uma proposta para uma futura melhoria desta aplicação. 
Sentimos que o projeto foi um desafio gratificante, que contribuiu bastante para o desenvolvimento das nossas capacidades de programação numa nova linguagem. 


## YAML – Server API Documentation
```yaml
openapi: "3.0.2"
info:
  title: CMDB APP
  description: CMDB API
  contact:
    email: you@your-company.com
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
  version: 1.0.0
servers:
  - description: Localhost server for testing API
    url: http://localhost:1996

tags:
  - name: Movies
  - name: Groups
  - name: Users

paths:
  /users:
    post:
      tags:
        - Users
      summary: adds a user
      description: Creats and Adds a user to the system
      operationId: addUser
      requestBody:
        description: User to  creat and add
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/NewUser"
        required: true 
      responses:
        201:
          description: user created
          content:
            application/json:
              schema:
                required:
                  - token
                type: object
                properties:
                  token:
                    type: string
                    format: uuid
        400:
          description: Invalid input, object invalid
          content: {}
      x-codegen-request-body-name: user
  
  /movies:
    get:
      tags:
        - Movies
      summary: lists Most Popular movies
      description: returns list of most popular movies in IMDB, can have a limit of movies returned, being max 250
      operationId: getMostPopular
      security:
        - bearerAuth: []
      parameters:
        - name: Authorization
          in: header
          required: true
          schema:
            type: string
            format: uuid
        - name: limit
          in: query
          description: maximum number of movies to return
          schema:
            maximum: 250
            minimum: 0
            type: integer
      responses:
        200:
          description: list of most popular movies
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/moviesResult"
        400:
          description: bad input parameter
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/InvalidRequest"

  /movies/{movieName}:
    get:
      tags:
        - getMovie
      summary: Get a movie given its name
      description: Get a movie given its name
      operationId: getMovie
      security:
        - bearerAuth: []
      parameters:
        - name: Authorization
          in: header
          schema:
            type: string
            format: uuid
        - name: movieName
          in: path
          description: Name of movie that to be fetched
          required: true
          schema:
            type: string
        - name: limit
          in: query
          description: campo opcional retornará no maximo 250 filmes correspondentes a este nome
          required: false
          schema:
            maximum: 250
            minimum: 0
            type: integer
      responses:
        200:
          description: successful operation
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/moviesResult"
        400:
          description: Invalid movieName supplied
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/InvalidRequest"
                example: Invalid movieName supplied
        404:
          description: movieName not found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/InvalidRequest"
                example: movieName Not found

  /groups:
    get:
      tags:
        - groups
      summary: get all groups
      description: get available groups # with the current user  # 
      operationId: getAllGroups
      security:
        - bearerAuth: []
      parameters:
        - name: Authorization
          in: header
          required: true
          schema:
            type: string
            format: uuid
      responses:
        200:
          description: lista todos os grupos de filmes
          content:
            application/json:
              schema:
                type: object
                items:
                  $ref: "#/components/schemas/groupsResult"
            
        400:
          description: bad input parameter
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/InvalidRequest"
    post:
      tags:
        - Groups
      summary: adds a group
      description: adds a group to the system
      operationId: createGroup
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
              $ref: "#/components/schemas/GroupRequest"
        required: true 
      responses:
        201:
          description: group created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Group"

        400:
          description: Invalid input, object invalid
          content: {}
      x-codegen-request-body-name: user

  /groups/{groupID}:
    get:
      tags:
        - Groups
      summary: Get a group given its id
      description: Get a group given its id
      operationId: getGroup
      security:
        - bearerAuth: []
      parameters:
        - name: Authorization
          in: header
          schema:
            type: string
            format: uuid
            minimum: 0
          required: true
        - name: groupID
          in: path
          description: ID of group that to be fetched
          required: true
          schema:
            type: integer
            minimum: 0
      responses:
        200:
          description: successful operation
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GroupRequest"
              
        400:
          description: Invalid groupID supplied
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/InvalidRequest"
                example: Invalid groupID supplied
        404:
          description: Group not found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/InvalidRequest"
                example: Group Not found
    put:
      tags:
        - Groups
      summary: updates a Group
      description: Updates a Group with ID in the system
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
        - name: groupID
          in: path
          description: ID of the group to be updated
          required: true
          schema:
            type: integer
            minimum: 0
      requestBody:
        description: Name and Description to updated 
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/GroupRequest"
        required: true
      responses:
        201:
          description: group updated
          content:
           application/json:
              schema:
                $ref: "#/components/schemas/GroupRequest"
        404:
          description: group not found
          content: {}
    delete:
      tags:
        - Groups
      summary: Delete a group by ID
      description: Delete a group by ID
      operationId: deleteGroup
      security:
        - bearerAuth: []
      parameters:
        - name: Authorization
          in: header
          required: true
          schema:
            type: string
            format: uuid
            minimum: 0
        - name: groupID
          in: path
          description: ID of the group to be deleted
          required: true
          schema:
            type: integer
            minimum: 0
      responses:
        200: 
          description: :Deletec successful
          content: {}
        400:
          description: Invalid ID supplied
          content: {}
        404:
          description: group not found
          content: {}

  /groups/{groupID}/{movieID}:
    put:
      tags:
        - Groups
      summary: updates a Group add a movieID
      description: Updates a Group with ID and push the movieID in that group in the system
      operationId: addMovieToGroup
      security:
        - bearerAuth: []
      parameters:
        - name: Authorization
          in: header
          required: true
          schema:
            type: string
            format: uuid
            example: 123
        - name: groupID
          in: path
          description: ID of the group to be updated
          required: true
          schema:
            type: integer
            minimum: 0
        - name: movieID
          in: path
          description: ID of the movie to be add
          required: true
          schema:
            type: integer
            minimum: 0
      responses:
        201:
          description: group updated
          content: {}
        400:
          description: Invalid ID supplied
          content: {}
        404:
          description: group not found or movie not found
          content: {}
    delete:
      tags:
        - Groups
      summary: remove o filme ao grupo em causa
      description: apaga o filme correspondente no grupo correspondente
      operationId: deleteMoviefromGroup
      security:
        - bearerAuth: []
      parameters:
        - name: groupID
          in: path
          description: ID of the group to be updated
          required: true
          schema:
            type: integer
        - name: movieID
          in: path
          description: ID of the movieID to be deleted
          required: true
          schema:
            type: integer
      responses:
        400:
          description: Invalid ID supplied
          content: {}
        404:
          description: group not found
          content: {}

components:
  securitySchemes:
    bearerAuth: # arbitrary name for the security scheme
      type: http
      scheme: bearer
      bearerFormat: JWT    # optional, arbitrary value for documentation purposes
  
  schemas:
  
    NewUser:
      required:
        - userName
      type: object
      properties:
        userName:
          type: string
          example: Joaquim

    moviesResult:
      type: object
      properties:
        movies:
          type: array
          items:
            $ref: "#/components/schemas/movieResult"

    movieResult:
      type: object
      properties:
        movieID:
          type: integer
          minimum: 0
        movieTitle:
          type: string
          example: "Game of Thrones"
        movieDuration:
          type: integer
          minimum: 0

    groupsResult:
      required:
        - userId
      type: object
      properties:
        userId:
          type: integer
          minimum: 0
        Groups:
          type: object
          items:
            $ref: "#/components/schemas/Group"
    Group:
      type: object
      properties:
        groupID:
          type: integer
          minimum: 0
        Name:
          type: string
          example: "filmes favoritos"
        Description:
          type: string
          example: " Filmes Excelentes"
        Group:
          type: object
          items:
            $ref: "#/components/schemas/movieResult"
            TotalDuration:
              type: integer
              minimum: 0

    groupResult:
      type: object
      properties:
        groupID:
          type: integer
          minimum: 0
        Name:
          type: string
          example: "filmes favoritos"
        Description:
          type: string
          example: " Filmes Excelentes"
        Group:
          type: object
          items:
            $ref: "#/components/schemas/movieResult"
            TotalDuration:
              type: integer
              minimum: 0

# POST GROUP  ---- adds a group ---- #
    GroupRequest:
      required:
        - Name
        - Description
      type: object
      properties:
        Name:
          type: string
          example: "action movies"
        Description:
          type: string
          example: "my favorite action movies"

# PUT GROUP  ---- modifie a group ---- #
    GroupRequestPut:
      required:
        - Name
        - Description
      type: object
      properties:
        Name:
          type: string
          example: "action movies"
        Description:
          type: string
          example: "my favorite action movies"

    groupUpdateRequest:
      required:
        - Name
        - Description
      type: object
      properties:
        userId:
          type: integer
        groupID:
          type: integer
          minimum: 0
        Name:
          type: string
          example: "filmes favoritos ID"
        Description:
          type: string
          example: " Filmes com  ID"
        Group:
          type: array
          items:
            $ref: "#/components/schemas/movieResult"
        TotalDuration:
          type: integer
          minimum: 0

    NewGroupAdd:
      required:
        - userId
        - groupID
        - movieID
      type: object
      properties:
        userId:
          type: integer
          minimum: 0
        Name:
          type: string
          example: "filmes ADD"
        Description:
          type: string
          example: "Os meus filmes ADD movie"
        Group:
          type: array
          items:
            $ref: "#/components/schemas/groupResult"

    InvalidRequest:
      type: object
      properties:
        error:
          type: string
          example: "Missing required parameter"
          
security:
  - bearerAuth: []         # use the same name as above```
