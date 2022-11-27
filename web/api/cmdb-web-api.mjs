// Module that contains the functions that handle all HTTP APi requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoque the corresponding operation on services
//  - Generate the response


//import * as cmdbServices from  '../../services/cmdb-services.mjs'
import toHttpResponse from './response-errors.mjs'

export default function (services) {
    // validate argument
    if (!services) {
        throw errors.INVALID_PARAMETER('services')
    }
    return {
        getGroups: handleRequest(getGroupsInternal),
        getGroup : handleRequest(getGroupInternal),
        deleteGroup : handleRequest(deleteGroupInternal),
        createGroup : handleRequest(createGroupInternal),
        updateGroup : handleRequest(updateGroupInternal),
        getMovies : handleRequest(getMoviesInternal),
        getMovie : handleRequest(getMovieInternal),
        deleteMovie : handleRequest(deleteMovieInternal),
        createUser : createUserInternal
    }

    // internal functions -----------------------------------------------------------------
    async function getGroupsInternal(req, rsp) {
        return services.getGroups(req.token, req.query.q, req.query.skip, req.query.limit)
    }

    async function getGroupInternal(req, rsp) {
        const groupId = req.params.id
        return services.getGroup(req.token, groupId)
    }
    
    async function deleteGroupInternal(req, rsp) {
        const groupId = req.params.id
        const group = await services.deleteGroup(req.token, groupId)
        return {
            status: `Group with id ${groupId} deleted with success`,
            group: group
        }
    }

    async function createGroupInternal(req, rsp) {
        let newGroup = await services.createGroup(req.token, req.body)
        rsp.status(201)
        return {
            status: `Group with id ${groupId} created with success`,
            group: newGroup
        }
    }

    async function updateGroupInternal(req, rsp) {
        const groupId = req.params.id
        const group = await services.updateGroup(req.token, groupId, req.body)
        return {
            status: `Group with id ${groupId} updated with success`,
            group: group
        }
    }

    async function getMoviesInternal(req, rsp) {
        console.log('WebAPI: ' + req.query.q)
        return services.getMovies(req.token, req.query.q, req.query.skip, req.query.limit)
    }

    async function getMovieInternal(req, rsp) {
        const idMovie = req.params.idMovie
        return services.getMovie(req.token, idMovie)
    }

    async function deleteMovieInternal(req, rsp) {
        const groupId = req.params.id
        const movieId = req.params.idMovie
        const movie = await services.deleteMovie(req.token, groupId, movieId)
        return {
            status: `Movie with id ${movieId} from group with id ${groupId} deleted with success`,
            movie: movie
        }
    }

    async function createUserInternal(req, rsp) {
        let newUser = await services.createUser(req.body.name)
        console.log("API: " + newUser.name)  // DEBUG
        rsp.status(201);
        return {
            status: `User with name ${newUser.name} created with success`,
            user: newUser
        };
    }


    // Auxiliary functions ----------------------------------------------------------------
    function buildNotFoundMessage(rsp, groupId) {
        rsp
            .status(404)
            .json({error: `Group with id ${groupId} not found`})
    }

    function handleRequest(handler) {
        return async function (req, rsp) {
            const BEARER_STR = "Bearer "
            const tokenHeader = req.get("Authorization")
            if (!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
                rsp
                    .status(401)
                    .json({ error: `Invalid authentication token` })
                return
            }
            req.token = tokenHeader.split(" ")[1]
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
