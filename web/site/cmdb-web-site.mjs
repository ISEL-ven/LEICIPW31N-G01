// Module that contains the functions that handle all HTTP Site requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoque the corresponding operation on services
//  - Generate the response in HTML format

import errors from "../../errors.mjs"

import toHttpResponse from '../api/response-errors.mjs'  // TODO não usar aqui os errors da API

const ROOT = '/cmdb/groups'
const HOME = '/cmdb/'

class View {
    constructor(name, data) {
        this.name = name
        this.data = data
    }
}

export default function (services) {
    // validate argument -----------------------------
    if (!services) {
        console.log('Web-api: services is missing!')
        throw errors.INVALID_PARAMETER('services')
    }
    return {
        getRoot: getRoot,
        getHome: getHome,
        loginForm: loginForm,
        validateLogin: validateLogin,
        verifyAuthenticated: verifyAuthenticated,
        logout: logout,
        getGroups: handleRequest(getGroupsInternal),
        getGroup: handleRequest(getGroupInternal),
        getNewGroupForm: handleRequest(getNewGroupForm),
        createGroup: handleRequest(createGroupInternal),
        deleteGroup: handleRequest(deleteGroupInternal),        
        updateGroup: handleRequest(updateGroupInternal),
        getUpdateGroupForm: handleRequest(getUpdateGroupForm),
        registerForm: registerForm,
        createUser: createUserInternal,


        getMovies: handleRequest(getMoviesInternal),
        getMovie: handleRequest(getMovieInternal),
        deleteMovie: handleRequest(deleteMovieInternal),        
        addMovie: handleRequest(addMovieInternal)
    }

    async function getRoot(req, rsp) {
        rsp.redirect(HOME)
    }

    async function getHome (req, rsp) {
        let user = {
            id: undefined,
            name: undefined,
            token: undefined
        }
        if (req.user != undefined){
            user.id = req.user.id
            user.name = req.user.name
            user.token = req.user.token
        }
        
        rsp.render('home', {user: user})
    }

    async function getGroupsInternal(req, rsp) {
        console.log(req.session)
        const groups = await services.getGroups(req.session.token, req.query.q, req.query.skip, req.query.limit)
        return new View('groups', { title: 'My playlists', groups: groups })
    }

    async function getGroupInternal(req, rsp) {
        const groupId = req.params.id
        const group = await services.getGroup(req.token, groupId)
        return new View('group', group)
    }

    async function getNewGroupForm(req, rsp) {
        rsp.render('newGroup')
    }

    async function deleteGroupInternal(req, rsp) {
        const groupId = req.params.id
        const group = await services.deleteGroup(req.token, groupId)
        rsp.redirect(ROOT)
    }

    async function createGroupInternal(req, rsp) {
        try {
            const newGroup = await services.createGroup(req.token, req.body)
            rsp.redirect(`${ROOT}/${newGroup.id}`)
        } catch (e) {
            if (e.code == 1) {
                return new View('newGroup', req.body)
            }
            throw e
        }        
    }

    async function getUpdateGroupForm(req, rsp) {

    }

    async function updateGroupInternal(req, rsp) {
        // TODO
    }

    async function getMoviesInternal(req, rsp) {
        // TODO
    }

    async function getMovieInternal(req, rsp) {
        // TODO
    }

    async function deleteMovieInternal(req, rsp) {
        // TODO
    }

    async function createUserInternal(req, rsp) {
        const name = req.body.username
        const token = req.session.token
        const user = await services.createWebUser(name, token)
        console.log(`createUserInternal: ${user.name}`)
        req.user = user
        getHome(req, rsp)
    }

    async function addMovieInternal(req, rsp) {
        // TODO
    }

    async function loginForm(req, rsp) {
        rsp.render('login')      
    }

    async function registerForm(req, rsp) {
        rsp.render('register')      
    }
      
      
    async function validateLogin(req, rsp) {
        console.log("validateLogin")
        if(validateUser(req.body.username, req.body.password)) {
            const user = {
                name: req.body.username,
                groups: req.body.groups,
                dummy: "dummy property on user"
            }
            console.log(user)
            req.login(user, () => rsp.redirect('/cmdb/'))
        }
        
        async function validateUser(username, password) { 
            // TODO #######################################
            return true 
        }
    }
    
    
    async function verifyAuthenticated(req, rsp, next) {
        console.log("verifyAuthenticated", req.user)
        if(req.user) {
            console.log("$$$$$$$$$$$$$$$$$")
            console.log(req.user)
            return next()
        }
        console.log("#################")
        rsp.redirect('/cmdb')
    }
    
    async function logout(req, rsp) {
    req.logout((err) => { 
        rsp.redirect('/cmdb/')
    })
    
    }

     // Auxiliary functions ----------------------------------------------------------------
     function handleRequest(handler) {
        
        return async function (req, rsp) {
            //verifyAuthenticated(req, rsp, next)
            try {
                let view = await handler(req, rsp)
                if (view) {
                    rsp.render(view.name, view.data)
                }                
            } catch (e) {
                const response = toHttpResponse(e)
                rsp.status(response.status).json({ error: response.body })
                console.log(e)
            }
        }
    }
}
