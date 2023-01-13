// Application Entry Point. 
// Register all HTTP API routes and starts the server

// import modules -----------------------------------------------------------------
import express from 'express'
import morgan from 'morgan'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import cors from 'cors'
import url from 'url'
import path from 'path'
import hbs from 'hbs'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import fileStore from 'session-file-store'
import crypto from 'crypto'
import serveFavicon from 'serve-favicon'

import * as groupsData from './data/cmdb-data-mem.mjs'
import * as usersData from './data/users-data.mjs'
import elasticData from './data/cmdb-data-elastic.mjs'
import * as moviesData from './data/cmdb-movies-data.mjs'
import servicesInit from './services/cmdb-services.mjs'
import apiInit from './web/api/cmdb-web-api.mjs'
import siteInit from './web/site/cmdb-web-site.mjs'

// global constants ----------------------------------------------------------------
const PORT = 3000
const swaggerDocument = yaml.load('./docs/cmdb-api.yaml')
const services = servicesInit(elasticData(), usersData, moviesData)
const api = apiInit(services)
const site = siteInit(services)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// App defenitions -----------------------------------------------------------------
console.log("Start setting up server")
let app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
//app.use(morgan('dev'))
app.use(serveFavicon(`${__dirname}/web/site/public/images/favicon-32x32.png`))

const FileStore = fileStore(session)
app.use(session({
    secret: "v4k3uG62GY3e4k",
    resave: false,
    saveUninitialized: false,
    store: new FileStore()
}))

// Passport initialization --------------------------------------------------------
//app.use(passport.authenticate('session'))
app.use(passport.session())
app.use(passport.initialize())

//passport.serializeUser(serializeUserDeserializeUser)
//passport.deserializeUser(serializeUserDeserializeUser)


// View engine setup ---------------------------------------------------------------
const viewsPath = path.join(__dirname, 'web', 'site', 'views')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(path.join(viewsPath, 'partials'))

app.use(sessionMiddleware)

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
app.use('/cmdb/public/', express.static(`${__dirname}/web/site/public/`))
app.get('/', site.getRoot)
app.get('/cmdb/', site.getHome)
app.get('/cmdb/groups/new/', site.getNewGroupForm)
app.get('/cmdb/groups', site.getGroups)
app.get('/cmdb/groups/:id', site.getGroup)
app.post('/cmdb/groups', site.createGroup)
app.post('/cmdb/groups/:id/delete', site.deleteGroup)
app.post('/cmdb/groups/:id/update', site.updateGroup)
app.get('/cmdb/groups/:id/update', site.getUpdateGroupForm)
app.post('/cmdb/groups/:id/:idMovie', site.addMovie)
app.post('/cmdb/groups/:id/:idMovie/delete', site.deleteMovie)
//app.get('/login', site.loginForm)
//app.post('/login', site.validateLogin)
//app.get('/register', site.registerForm)
//app.post('/register', site.createUser)
//app.get('/logout', site.logout)
//app.post('/logout', site.logout)
app.get('/commingsoon', site.commingSoon)

app.get('/cmdb/search', site.getMovies)
app.get('/cmdb/search/:idMovie', site.getMovie)


// Start App -----------------------------------------------------------------------
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}\nEnd setting up server`))

// Route handling functions ---------------------------------------------------------
function sessionMiddleware(req, rsp, next) {
    req.session.token = req.session.token || crypto.randomUUID()
    //req.session.counter = (req.session.counter || 0) + 1
    //console.log(`Session counter: ${req.session.counter}`)

    //console.log(`Session token: ${req.session.token}`)
    next()
}

/*function serializeUserDeserializeUser(user, done) {
    done(null, user)
}

function serializeUser(user, done) {
    done(null, user)
}*/
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username })
    })
})
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user)
    })
})
