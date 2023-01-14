// Module that contains the functions that handle all HTTP Site requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoque the corresponding operation on services
//  - Generate the response in HTML format

import { group } from "console"
import movies from "../../data/cache/movies.mjs"
import errors from "../../errors.mjs"

import toHttpResponse from '../api/response-errors.mjs'  // TODO não usar aqui os errors da API

const ROOT = '/cmdb/groups'
const HOME = '/cmdb/'
//const HAMMERED_TOKEN = '8bf716e7-e3af-4343-93e0-9c6edb7b8005'

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
        getGroups: handleRequest(getGroupsInternal),
        getGroup: handleRequest(getGroupInternal),
        getNewGroupForm: handleRequest(getNewGroupForm),
        createGroup: createGroupInternal,
        deleteGroup: handleRequest(deleteGroupInternal),        
        updateGroup: handleRequest(updateGroupInternal),
        getUpdateGroupForm: handleRequest(getUpdateGroupForm),
        getMovie: handleRequest(getMoviesInternal),
        getMovieDetails : getMovieDetailsInternal,
        addMovie: addMovieInternal,  // FALTA PASSAR PELO HANDLER
        deleteMovie: deleteMovieInternal, // FALTA PASSAR PELO HANDLER

        getMovies: handleRequest(getMoviesInternal),        
        
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
        //const groups = await services.getGroupsWeb(req.session.token, req.query.q, req.query.skip, req.query.limit)
        const groups = await services.getGroupsWeb(req.token, req.query.q, req.query.skip, req.query.limit)
        //console.log("                                               GET GROUPS INTERNAL")
        //console.log(groups)
       // console.log("getGroupsInternal");
       // console.log(groups);
        return new View('groups', { title: 'My playlists', groups: groups })
    }

    async function getGroupInternal(req, rsp) {
        const groupId = req.params.id
        //const group = await services.getGroup(req.token, groupId)
        const group = await services.getGroup(req.token, groupId)
        // console.log("getGroupInternal");
        // console.log(group);
        return new View('groupdetail', group)
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
        //console.log(req.body)
        try {
            const newGroup = await services.createGroup(req.token, req.body)
            //const newGroup = await services.createGroup(req.token, req.body)
            //rsp.redirect(`${ROOT}/${newGroup.id}`)
            rsp.redirect(`${ROOT}`)
        } catch (e) {
            if (e.code == 1) {
                return new View('newGroup', req.body)
            }
            throw e
        }        
    }

    async function getUpdateGroupForm(req, rsp) {

        const groupId = req.params.id
        const group = await services.getGroup(req.token, groupId)

        return rsp.render('groupEdit', group)
    
    }

    async function updateGroupInternal(req, rsp) {
        const paramsId = req.params.id

        try {
            const newGroup = await services.updateGroup(req.token, paramsId, req.body)
            
            //const newGroup = await services.createGroup(req.token, req.body)
            //rsp.redirect(`${ROOT}/${newGroup.id}`)
            rsp.redirect(`${ROOT}`)
        } catch (e) {
            if (e.code == 1) {
                return new View('newGroup', req.body)
            }
            throw e
        }        
    }

    async function getMoviesInternal(req, rsp) {
        // console.log(`SEARCH MOVIES -> ${req.query}`)
        const groups = await services.getGroups(req.token)
        const movies = await services.getMoviesByName(req.token, req.query.q, req.query.skip, req.query.limit)      //gets all movies
        movies.map(x => x.groups = {groups})
        rsp.render('movies', {movies: movies})
    }

    async function getMovieDetailsInternal(req, rsp) {
       
        const idMovie =req.params.id
        const movie = await services.getMovieDetails(req.token,idMovie)
        // console.log(                            "_MOOOOOVIEEEEEEEEE_________")
        // console.log(movie)
        rsp.render("movie-detail", movie)
        // TODO
    }

    async function deleteMovieInternal(req, rsp) {
        const userToken = req.token
        const groupId = req.params.id
        const movieId = req.params.idMovie
        const groupUpdated = await services.deleteMovie(userToken, groupId, movieId)
        // console.log ("FINALLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
        // console.log (groupUpdated)
        //return new View('groupdetail', groupUpdated)
        rsp.render(`groupdetail`, groupUpdated)
    }

    async function addMovieInternal(req, rsp) {
        //console.log(req)
        const userToken = req.token
        const groupId = req.params.id
        const movieId = req.params.idMovie
        const movie = await services.addMovie(userToken, groupId, movieId)
        //todo
        getHome(req, rsp)
        
    }
    
     // Auxiliary functions ----------------------------------------------------------------
     function handleRequest(handler) {
        
        return async function (req, rsp) {
            //verifyAuthenticated(req, rsp, next)
            try {
                //console.log('##############################################')
                let view = await handler(req, rsp)
                if (view) {
                    rsp.render(view.name, view.data)
                }                
            } catch (e) {
                console.log('HANDLER ERROR ---------------------------------------------------------------')
                const response = toHttpResponse(e)
                rsp.status(response.status).json({ error: response.body })
                console.log(e)
            }
        }
    }
}
