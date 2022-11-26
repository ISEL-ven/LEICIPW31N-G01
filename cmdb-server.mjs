// Application Entry Point. 
// Register all HTTP API routes and starts the server

import express from 'express'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import cors from 'cors'

import * as cmdbData from './data/cmdb-data-mem.mjs'
import * as imdbData from './data/cmdb-movies-data.mjs'
//import servicesInit from './services/cmdb-services.mjs'
//import apiInit from './web/api/cmdb-web-api.mjs'
//import siteInit from './web/site/cmdb-web-site.mjs'

const PORT = 65432
const swaggerDocument = yaml.load('./docs/cmdb-api.yaml')
//const services = servicesInit(cmdbData, imdbData)
//const api = apiInit(services)
//const site = siteInit(services)

console.log("Start setting up server")
let app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())

// Route handling functions ------------------------------------------------------
//app.get('/tasks', api.getTasks)
//app.get('/tasks/:id', api.getTask)
//app.delete('/tasks/:id', api.deleteTask)
//app.post('/tasks', api.createTask)
//app.put('/tasks/:id', api.updateTask)

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log("End setting up server")

