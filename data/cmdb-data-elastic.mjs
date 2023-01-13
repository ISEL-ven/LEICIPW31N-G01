import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './elastic-constants.mjs'
import {getMovieById, getMovieByIdExternal} from './cmdb-movies-data.mjs'


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
        return get(URI_MANAGER_GROUPS.getAll(), query)
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
          return get(URI_MANAGER_USERS.getAll(), query)
            .then(body => body.hits.hits.map(createUserFromElastic)[0])
    }

    /*async function getUserByGroupId( id) {
        return get(URI_MANAGER_GROUPS.get(id))
            .then(createGroupFromElasticSendUser)
            
    }*/

    async function createGroup(userID,groupToCreate) {
        //console.log("createGroup_____elastic")
        let newGroup = {
            title: groupToCreate.title,
            description: groupToCreate.description,
            userId: userID,
            totalDuration: 0,
            numMovies: 0,
            movies: []
        }
        return post(URI_MANAGER_GROUPS.create(), newGroup)
            .then(body => { newGroup.id = body._id; return newGroup })
    }
    
    async function addMovie(userID, groupId, movieId) {
        const movieComplete = await getMovieById(movieId)
        const movieInfo = await getMovieByIdExternal(movieId)
        let duration = parseInt(movieInfo.runtimeMins)
        if (duration == null || isNaN(duration)) duration = 0       //if duration is null or Nan it is set to zero
        const movie = {
            id: movieComplete.id,
            title: movieComplete.title,
            image: movieComplete.image,
            description: movieComplete.description,
            runtimeMins: duration,
            director: movieInfo.directors,
            actors: movieInfo.actorList,
        }
        const group = await getDetailsFromGroup(groupId)    //gets movie from elastic database
        group.totalDuration += movie.runtimeMins
        group.numMovies++
        group.movies.push(movie)
        return put(URI_MANAGER_GROUPS.addTo(groupId), group)
            .then( () => { return movie })
    }

    async function updateGroup(group) {
       // console.log("updateGroup")
    }

    async function createUser(user) {
        //console.log("/n elastic - createUser/n")
        const query ={
            "script": {
                "source": "ctx._source.users.add(params.newUser)",
                "lang": "painless",
                "params": {
                    "newUser": {
                        id: user.token, 
                        name: user.name
                    }
                }
            }
          }
        return(post(URI_MANAGER_USERS.create())
            .then(post(URI_MANAGER_USERS.addTo(user), query)
                .then( () => { return newUser })))
    }

    async function deleteGroup(id) {
        // console.log("id ")
        // console.log(id)
        return del(URI_MANAGER_GROUPS.delete(id), )
            .then(body => body._id)
    }

    async function deleteMovie(userId, groupId, movieId) {
        let group = await getDetailsFromGroup(groupId)    //gets movie from elastic database
        const allMovies = group.movies
        const movieToRemove = allMovies.find((it) => { return it.id == movieId})
        //console.log("                                          MovieToRemove...THIS IS")
        //console.log(movieToRemove)
            group.totalDuration -= movieToRemove.runtimeMins
            group.numMovies--
            group.movies.splice(allMovies.indexOf(movieToRemove),1)
        //console.log("                                          Group...THIS IS")
        //console.log(group)
        //console.log("                                          Group.movies...THIS IS")
        //console.log(group.movies)
        return put(URI_MANAGER_GROUPS.addTo(groupId), group)
        .then( () => { return group })
        //return del(URI_MANAGER_MOVIES.delete(movieId), )
        //.then(body => body._id)
        
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