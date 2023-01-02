// imported external modules ----------------------------------------------------------------------
import express from 'express'
import passport from 'passport'
import session from 'express-session'


export default function(services) {
    //const app = express.Router()
    const app = express()

    app.use(session( {
        secret: "v4k3uG62GY3e4k",
        resave: false,
        saveUninitialized: false
    }))

    // Passport initialization --------------------------------------------------------------------
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))    
    

    app.use('/cmdb/groups', verifyAuthenticated)
    app.get('/login', loginForm)                    // Get the login form
    app.post('/login', login)                       // Verify login credentials
    app.post('/logout',logout)                      // Get a form to create a game
    
    return app    

    function verifyAuthenticated(req, rsp, next) {
        if(req.user) {
            return next()
        }
            
        rsp.redirect('/login')
    }

    function loginForm(req, rsp) {
        rsp.render('login')
    }

    async function login(req, rsp) {
        let token = await services.validateCredentials(req.body.username, req.body.password)
        if(token) {            
            return req.login(token, (err) => rsp.redirect('/cmdb/'))
        } 
        rsp.render('login', {username: req.body.username, message: "Invalid credentials"})
    }

    function logout(req, rsp) {
        req.logout((err) => rsp.redirect('/cmdb/'))
        
    }
}