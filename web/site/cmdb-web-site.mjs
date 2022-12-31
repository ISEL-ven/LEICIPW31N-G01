// Module that contains the functions that handle all HTTP Site requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoque the corresponding operation on services
//  - Generate the response in HTML format


//import * as cmdbServices from  '../../services/cmdb-services.mjs' já estava comentado

//import toHttpResponse from './response-errors.mjs'

// TODO: token martelado - apagar!!!!
const TOKEN = 'martelado'

function View(name, data) {
    this.name = name
    this.data = data
}

export default function (services) {
    // validate argument -----------------------------
    if (!services) {
        console.log('Web-api: services is missing!')
        throw errors.INVALID_PARAMETER('services')
    }
    return {
        getGroups: handleRequest(getGroupsInternal),
        getGroup: handleRequest(getGroupInternal),
        deleteGroup: handleRequest(deleteGroupInternal),
        createGroup: handleRequest(createGroupInternal),
        updateGroup: handleRequest(updateGroupInternal),
        getMovies: handleRequest(getMoviesInternal),
        getMovie: handleRequest(getMovieInternal),
        deleteMovie: handleRequest(deleteMovieInternal),
        createUser: handleRequest(createUserInternal),
        addMovie: handleRequest(addMovieInternal)
    }

    async function getGroupsInternal(req, rsp) {
        const groups = await services.getGroups(req.token, req.query.q, req.query.skip, req.query.limit)
        return new View('groups', { title: 'All groups', groups: groups })
        
        //rsp.render('goups', { title: 'All groups', groups: groups })
    }

    async function getGroupInternal(req, rsp) {
        const groupId = req.params.id
        const group = await services.getGroup(req.token, groupId)
        return new View('group', group)
    }

    async function deleteGroupInternal(req, rsp) {
        // TODO
    }

    async function createGroupInternal(req, rsp) {
        // TODO
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
        // TODO
    }

    async function addMovieInternal(req, rsp) {
        // TODO
    }

     // Auxiliary functions ----------------------------------------------------------------
     function handleRequest(handler) {
        return async function (req, rsp) {
            req.token = 'TODO: martelar token'
               
            try {
                let view = await handler(req, rsp)
                rsp.render(view.name, view.data)
            } catch (e) {
                const response = toHttpResponse(e)
                rsp.status(response.status).json({ error: response.body })
                console.log(e)
            }
        }
    }
}
