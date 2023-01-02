// Module manages application data.
// In this specific module, data is stored in memory


import errors from '../errors.mjs'
import movies from './cache/movies.mjs'
import {getMovieById, getMovieByIdExternal} from './cmdb-movies-data.mjs'

let groups = []
let nextGroupId = 0

export async function getGroups() {
    console.log(`GroupsData-getGroups`)
    return groups
}

export async function getGroup(groupId) {
    console.log(`GroupsData-getGroup: groupId-${groupId}`)
    const group =  groups.find(group => group.id == groupId)
    return group
}

export async function deleteGroup(userId, groupId) {
    console.log(`GroupsData-deleteGroup: groupId-${groupId}`)
    const groupIdx = groups.findIndex(group => group.id == groupId)
    if(groupIdx != -1) {
        groups.splice(groupIdx, 1)
        return true
    } 
    return false
}

export async function createGroup(userId, groupToCreate) {
    console.log(groupToCreate)
    //console.log(`GroupsData-createGroup: groupToCreate-${groupToCreate}`)
    let newGroup = {
        id: getNewId(), 
        title: groupToCreate.title,
        description: groupToCreate.description,
        userId: userId,
        totalDuration: 0,
        numMovies: 0,
        movies: []
    }
    groups.push(newGroup)
    return newGroup
}

export async function updateGroup(userId, groupId, newGroup) {
    console.log(`GroupsData-updateGroup: groupId-${groupId}, newGroup-${newGroup}`)
    const group = groups.find(group => group.id == groupId)
    if(group != undefined) {
        group.title = newGroup.title
        group.description = newGroup.description
        return group
    } 
}

export async function addMovie(userId, groupId, movieId) {
    console.log(`GroupsData-addMovie: userID-${userId}, groupId-${groupId}, movie-${movieId}`)
    const idxGroup = groups.findIndex(group => group.id == groupId && group.userId == userId);
    if (idxGroup == -1) throw errors.NOT_FOUND("Group");
    const newMovie = getMovieById(movieId)    
    let duration = newMovie.runtimeMins
    if (!duration) {
        let movie = await getMovieByIdExternal(movieId)
        duration = parseInt(movie.runtimeMins)
    }
    newMovie.runtimeMins = duration
    groups[idxGroup].totalDuration += duration
    groups[idxGroup].numMovies++
    groups[idxGroup].movies.push(newMovie)
    return newMovie
}

export async function deleteMovie(userId, groupId, movieId) {
    console.log(`GroupsData-deleteMovie: userID-${userId}, groupId-${groupId}, movie-${movieId}`)
    const idxGroup = groups.findIndex(group => group.id == groupId && group.userId == userId);
    if (idxGroup == -1) throw errors.NOT_FOUND("Group")
    const idxMovie = groups[idxGroup].movies.find(movie => movie.id == movieId)
    if (idxMovie == -1) throw errors.NOT_FOUND("Movie")
    let movie = await getMovieByIdExternal(movieId)
    const duration = parseInt(movie.runtimeMins)
    const movieRemoved = groups[idxGroup].movies.splice(idxMovie-1, 1)
    groups[idxGroup].totalDuration -= duration
    groups[idxGroup].numMovies--

    return movieRemoved
}

// Auxiliary functions ---------------------------------------------------------
function getNewId() {
    return nextGroupId++
}
