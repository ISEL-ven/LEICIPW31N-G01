// Module that contains the functions that handle all HTTP Site, user requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoque the corresponding operation on services
//  - Generate the response in HTML format

import errors from "../../errors.mjs"
import toHttpResponse from '../api/response-errors.mjs'  // TODO não usar aqui os errors da API

const ROOT = '/cmdb/groups'
const HOME = '/cmdb/'
const HAMMERED_TOKEN = '8bf716e7-e3af-4343-93e0-9c6edb7b8005'

export default function (services) {
    // validate argument -----------------------------
    if (!services) {
        console.log('Web-api: services is missing!')
        throw errors.INVALID_PARAMETER('services')
    }
    return {
        getRoot: getRoot,
        loginForm: loginForm,
        validateLogin: handleRequest(validateLogin),
        registerForm: registerForm,
        createUser: handleRequest(createUserInternal),
        logout: logout
    }

    async function getRoot(req, rsp) {
        rsp.redirect(HOME)
    }

    async function registerForm(req, rsp) {
        rsp.render('register')      
    }

    async function createUserInternal(req, rsp) {
        const name = req.body.username
        const password = req.body.password
        const user = await services.createWebUser(name, password)
        //authentication process
        req.token = user.token
        
        req.login(user, () => rsp.redirect(HOME) )
    }

    async function loginForm(req, rsp) {
        rsp.render('login')      
    }

    async function validateLogin(req, rsp) {
        const username = req.body.username
        const password = req.body.password
        const user = await services.getUser(username, password) //validates user and returns it if exists and valid 
        
        if (user) req.login(user, () => {return rsp.render('home', {user: user})})
    }
    
    async function logout(req, rsp, next) {
        req.logout((err) => rsp.redirect(HOME))
    }

     // Auxiliary functions ----------------------------------------------------------------
     function handleRequest(handler) {
        return async function (req, rsp) {
            try {
                let view = await handler(req, rsp)
                if (view) {
                    rsp.render(view.name, view.data)
                }                
            } catch (e) {
                console.log('                        CMDB-USERS - HANDLER ERROR ')
                const response = toHttpResponse(e)
                rsp.status(response.status).json({ error: response.body })
                console.log(e)
            }
        }
    }
}
