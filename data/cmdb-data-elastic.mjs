import {get, post} from './fetch-wrapper.mjs'
import uriManager from './elastic-constants.mjs'

export default function () {
    const INDEX_NAME_GROUPS = 'groups'
    const INDEX_NAME_MOVIES = 'movies'
    const INDEX_NAME_USERS = 'users'
    const URI_MANAGER_GROUPS = uriManager(INDEX_NAME_GROUPS)
    const URI_MANAGER_MOVIES = uriManager(INDEX_NAME_MOVIES)
    const URI_MANAGER_USERS = uriManager(INDEX_NAME_USERS)

    return {
        createGroup,
        updateGroup,
        getGroups,
        deleteGroup,
        getDetailsFromGroup,
        addMovie,
        deleteMovie,
        createUser,
        getUserByToken//,
        //getUserByGroupId
    }

    async function getGroups(userId) {
        const query = {
            query: {
              match: {
                "ownerUser": userId
              }
            }
          }
        return post(URI_MANAGER_GROUPS.getAll(), query)
            .then(body => body.hits.hits.map(createGroupFromElastic))

    }

    async function getDetailsFromGroup(id) {
        return get(URI_MANAGER_GROUPS.get(id))
            .then(createGroupFromElastic)
    }

    async function getUserByToken(token) {
        const query = {
            query: {
              match: {
                "authToken": token
              }
            }
          }
          return post(URI_MANAGER_USERS.getAll(), query)
            .then(body => body.hits.hits.map(createUserFromElastic)[0])
    }

    /*async function getUserByGroupId( id) {
        return get(URI_MANAGER_GROUPS.get(id))
            .then(createGroupFromElasticSendUser)
            
    }*/

    async function createGroup(group) {
        const newGroup = Object.assign(group)
        return post(URI_MANAGER_GROUPS.create(), newGroup)
            .then(body => { newGroup.id = body._id; return newGroup })
    }

    async function addMovie(movie) {
        const newMovie = Object.assign(movie)
        const query ={
            "script": {
                "source": "ctx._source.movies.add(params.newMovie)",
                "lang": "painless",
                "params": {
                    "newMovie": {
                        id: movie.id, 
                        name: movie.name, 
                        image: movie.image, 
                        runTimeMins: movie.runTimeMins
                    }
                }
            }
          }
        return post(URI_MANAGER_GROUPS.addTo(newMovie.groupId), query)
            .then( () => {  return newMovie })
    }

    async function updateGroup(group) {
        console.log("updateGroup")
    }

    async function createUser(user) {
        console.log("createUser")
    }

    async function deleteGroup(id) {
        return del(URI_MANAGER_GROUPS.delete(id), )
            .then(body => body._id)
    }

    async function deleteMovie(id, movie) {
        return del(URI_MANAGER_MOVIES.delete(movie), )
            .then(body => body._id)
    }


    function createGroupFromElastic(groupElastic) {
        let group = groupElastic._source
        group.id = groupElastic._id
        return group
    }

    function createGroupFromElasticSendUser(groupElastic) {
        let group = groupElastic._source
        group.id = groupElastic._id
        return group.ownerUser
    }

    function createUserFromElastic(userElastic) {
        let user = userElastic._source
        user.id = userElastic._id
        return user
    }    
}