import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './elastic-constants.mjs'
import {getMovieById, getMovieByIdExternal} from './cmdb-movies-data.mjs'


export default function () {
    const INDEX_NAME_GROUPS = 'groups'
    const URI_MANAGER_GROUPS = uriManager(INDEX_NAME_GROUPS)

    return {
        createGroup,
        updateGroup,
        getGroups,
        deleteGroup,
        getDetailsFromGroup,
        addMovie,
        deleteMovie
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

    async function createGroup(userID,groupToCreate) {
        const newGroup = {
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
        let group = await getDetailsFromGroup(groupId)    //gets movie from elastic database
        group.totalDuration += movie.runtimeMins
        group.numMovies++
        group.movies.push(movie)

        return put(URI_MANAGER_GROUPS.addTo(groupId), group)
            .then( () => { return movie })
    }

    async function updateGroup(userID, groupId, groupToCreate) {
        const name = groupToCreate.title
        const description = groupToCreate.description
        let group = await getDetailsFromGroup(groupId) 
        group.title = name
        group.description = description

        return put(URI_MANAGER_GROUPS.addTo(groupId), group)
            .then( () => { return group })
    }

    async function deleteGroup(id) {
        return del(URI_MANAGER_GROUPS.delete(id), )
            .then(body => body._id)
    }

    async function deleteMovie(userId, groupId, movieId) {
        let group = await getDetailsFromGroup(groupId)    //gets movie from elastic database
        const allMovies = group.movies
        const movieToRemove = allMovies.find((it) => { return it.id == movieId })
        group.totalDuration -= movieToRemove.runtimeMins
        group.numMovies--
        group.movies.splice(allMovies.indexOf(movieToRemove),1)
        
        return put(URI_MANAGER_GROUPS.addTo(groupId), group)
            .then( () => { return group })
    }

    function createGroupFromElastic(groupElastic) {
        let group = groupElastic._source
        group.id = groupElastic._id
        return group
    }
}
