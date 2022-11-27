// Application Entry Point. 
// Register all HTTP API routes and starts the server

// import modules -----------------------------------------------------------------
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import cors from 'cors'

import * as groupsData from './data/cmdb-data-mem.mjs'
import * as usersData from './data/users-data.mjs'
import * as moviesData from './data/cmdb-movies-data.mjs'
import servicesInit from './services/cmdb-services.mjs'
import apiInit from './web/api/cmdb-web-api.mjs'
//import siteInit from './web/site/cmdb-web-site.mjs'


// global constants ----------------------------------------------------------------
const PORT = 3000
const swaggerDocument = yaml.load('./docs/cmdb-api.yaml')
const services = servicesInit(groupsData, usersData, moviesData)
const api = apiInit(services)
//const site = siteInit(services)

// App defenitions -----------------------------------------------------------------
console.log("Start setting up server")
let app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())

// Web API routes -------------------------------------------------------------------
app.get('/groups', api.getGroups)
app.get('/groups/:id', api.getGroup)
app.delete('/groups/:id', api.deleteGroup)
app.post('/groups', api.createGroup)
app.put('/groups/:id', api.updateGroup)
app.get('/search', api.getMovies)
app.get('/search/:idMovie', api.getMovie)
app.delete('/groups/:id/:idMovie', api.deleteMovie)
app.post('/users', api.createUser)

// Web site routes -----------------------------------------------------------------


// Start App -----------------------------------------------------------------------
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`))

console.log("End setting up server")
