// Application Entry Point. 
// Register all HTTP API routes and starts the server

// import modules -----------------------------------------------------------------
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import cors from 'cors'
import url from 'url'
import path from 'path'
import hbs from 'hbs'

import * as groupsData from './data/cmdb-data-mem.mjs'
import * as usersData from './data/users-data.mjs'
import * as moviesData from './data/cmdb-movies-data.mjs'
import servicesInit from './services/cmdb-services.mjs'
import apiInit from './web/api/cmdb-web-api.mjs'
import siteInit from './web/site/cmdb-web-site.mjs'

// global constants ----------------------------------------------------------------
const PORT = 3000
const swaggerDocument = yaml.load('./docs/cmdb-api.yaml')
const services = servicesInit(groupsData, usersData, moviesData)
const api = apiInit(services)
const site = siteInit(services)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// App defenitions -----------------------------------------------------------------
console.log("Start setting up server")
let app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use(express.urlencoded())

// View engine setup ---------------------------------------------------------------
const viewsPath = path.join(__dirname, 'web', 'site', 'views')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(path.join(viewsPath, 'partials'))

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
app.post('/groups/:id/:idMovie', api.addMovie)

// Web site routes -----------------------------------------------------------------
app.use('/cmdb/static', express.static(`${__dirname}./static-files/`))
app.get('cmdb/groups/new/', site.getNewGroupForm)
app.get('/cmdb/groups', site.getGroups)
app.get('/cmdb/groups/:id', site.getGroup)
app.post('/cmdb/groups', site.createGroup)


app.delete('/cmdb/groups/:id', site.deleteGroup)
app.put('/cmdb/groups/:id', site.updateGroup)
app.get('/cmdb/search', site.getMovies)
app.get('/cmdb/search/:idMovie', site.getMovie)
app.delete('/cmdb/groups/:id/:idMovie', site.deleteMovie)
app.post('/cmdb/users', site.createUser)
app.post('/cmdb/groups/:id/:idMovie', site.addMovie)

// Start App -----------------------------------------------------------------------
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}\nEnd setting up server`))

