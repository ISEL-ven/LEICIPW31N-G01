// Module that contains the functions that handle all HTTP API requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoque the corresponding operation on services
//  - Generate the response in JSON format


//import * as cmdbServices from  '../../services/cmdb-services.mjs'
import toHttpResponse from './response-errors.mjs'

export default function (services) {
    // validate argument -----------------------------
    if (!services) {
        console.log('Web-api: services is missing!')
        throw errors.INVALID_PARAMETER('services')
    }
    return {
        getGroups: handleRequest(getGroupsInternal, true),
        getGroup : handleRequest(getGroupInternal, true),
        deleteGroup : handleRequest(deleteGroupInternal, true),
        createGroup : handleRequest(createGroupInternal, true),
        updateGroup : handleRequest(updateGroupInternal, true),
        getMovies : handleRequest(getMoviesInternal, true),
        getMovie : handleRequest(getMovieInternal, true),
        deleteMovie : handleRequest(deleteMovieInternal, true),
        createUser : handleRequest(createUserInternal, false),
        addMovie : handleRequest(addMovieInternal, true)
    }

    // internal functions -----------------------------------------------------------------
    async function getGroupsInternal(req, rsp) {
        console.log(`WebAPI-getGroups: token-${req.token}, q-${req.query.q}, skip-${req.query.skip}, limit-${req.query.limit}`)
        rsp.status(200)
        return services.getGroups(req.token, req.query.q, req.query.skip, req.query.limit)
    }

    async function getGroupInternal(req, rsp) {
        const groupId = req.params.id
        console.log(`WebAPI-getGroup: token-${req.token}, groupId-${groupId}}`)
        rsp.status(200)
        return services.getGroup(req.token, groupId)
    }
    
    async function deleteGroupInternal(req, rsp) {
        const groupId = req.params.id
        const group = await services.deleteGroup(req.token, groupId)
        console.log(`WebAPI-deleteGroup: token-${req.token}, groupId-${groupId}, group-${group}`)
        rsp.status(201)
        return {
            status: `Group with id ${groupId} deleted with success`,
            group: group
        }
    }

    async function createGroupInternal(req, rsp) {
        let newGroup = await services.createGroup(req.token, req.body)
        rsp.status(201)
        console.log(`WebAPI-createGroup: token-${req.token}, title-${req.body.title}, description-${req.body.description}`)
        return {
            status: `Group with id ${newGroup.id} created with success`,
            group: newGroup
        }
    }

    async function updateGroupInternal(req, rsp) {
        const group = await services.updateGroup(req.token, req.params.id, req.body)
        console.log(`WebAPI-updateGroup: token-${req.token}, groupId-${req.params.id}, body-${req.body}`)
        rsp.status(201)
        return {
            status: `Group with id ${req.params.id} updated with success`,
            group: group
        }
    }

    async function getMoviesInternal(req, rsp) {
        console.log(`WebAPI-getMovies: token-${req.token}, q-${req.query.q}, skip-${req.query.skip}, limit-${req.query.limit}`)
        rsp.status(200)
        return services.getMovies(req.token, req.query.q, req.query.skip, req.query.limit)
    }

    async function getMovieInternal(req, rsp) {
        const idMovie = req.params.idMovie
        console.log(`WebAPI-getMovie: token-${req.token}, movieId-${idMovie}`)
        rsp.status(200)
        return services.getMovie(req.token, idMovie)
    }

    async function addMovieInternal(req, rsp) {
        const groupId = req.params.id
        const movieId = req.params.idMovie
        const movie = await services.addMovie(req.token, groupId, movieId)
        console.log(`WebAPI-addMovie: token-${req.token}, groupId-${groupId}, movieId-${movieId}`)
        rsp.status(201)
        return {
            status: `Movie with id ${movieId} from group with id ${groupId} added with success`,
            movie: movie
        }
    }

    async function deleteMovieInternal(req, rsp) {
        const groupId = req.params.id
        const movieId = req.params.idMovie
        const movie = await services.deleteMovie(req.token, groupId, movieId)
        console.log(`WebAPI-deleteMovie: token-${req.token}, groupId-${groupId}, movieId-${movieId}`)
        rsp.status(201)
        return {
            status: `Movie with id ${movieId} from group with id ${groupId} deleted with success`,
            movie: movie
        }
    }

    async function createUserInternal(req, rsp) {
        let newUser = await services.createUser(req.body.name)
        console.log(`WebAPI-createUser: body-${req.body}`)
        rsp.status(201);
        return {
            status: `User with name ${newUser.name} created with success`,
            user: newUser
        };
    }


    // Auxiliary functions ----------------------------------------------------------------
    function handleRequest(handler, needAuthentication) {
        return async function (req, rsp) {
            if (needAuthentication) {
                const BEARER_STR = "Bearer "
            const tokenHeader = req.get("Authorization")
            if (!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
                rsp
                    .status(401)
                    .json({ error: `Invalid authentication token` })
                return
            }
            req.token = tokenHeader.split(" ")[1]
            }            
            try {
                let body = await handler(req, rsp)
                rsp.json(body)
            } catch (e) {
                const response = toHttpResponse(e)
                rsp.status(response.status).json({ error: response.body })
                console.log(e)
            }
        }
    }
}
