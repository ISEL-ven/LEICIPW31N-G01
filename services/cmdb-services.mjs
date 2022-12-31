// Module contains all CMDB management logic

import {MAX_LIMIT} from './services-constants.mjs'
import errors from '../errors.mjs'

export default function(groupsData, usersData, moviesData) {
    if (!groupsData) {
        console.log('Services: groupsData is missing')
        throw errors.INVALID_PARAMETER('groupsData')
    }
    if (!usersData) {
        console.log('Services: usersData is missing')
        throw errors.INVALID_PARAMETER('usersData')
    }
    if (!moviesData) {
        console.log('Services: moviesData is missing')
        throw errors.INVALID_PARAMETER('moviesData')
    }

    return {
        getGroups: getGroups,             // groups from user
        getGroup: getGroup,              // especific group 
        updateGroup: updateGroup,       // group name, etc
        deleteGroup: deleteGroup,      // remove group from user
        createGroup: createGroup,     // add new group to user
        getMovies: getMovies,        // search movies
        getMovie: getMovie,         // get especific movie
        deleteMovie: deleteMovie,  // remove movie from group
        addMovie: addMovie,       // add movie to group
        createUser : createUser  // add user
    }

    async function getGroups(userToken, q, skip=0, limit=MAX_LIMIT) {
        console.log(`Services-getGroups: userToken-${userToken}, q-${q}, skip-${skip}, limit-${limit}`)
        limit = Number(limit)
        skip = Number(skip)
        if (   isNaN(limit)
            || isNaN(skip)
            || skip > MAX_LIMIT
            || limit > MAX_LIMIT
            || (skip + limit) > MAX_LIMIT
            || skip  < 0
            || limit < 0
            ) {
                throw errors.INVALID_PARAMETER('skip or limit', `Skip and limit must be positive, less than ${MAX_LIMIT} and its sum must be less or equal to ${MAX_LIMIT}`)
            }

        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        return groupsData.getGroups(user.id, q, skip, limit)
    }

    async function getGroup(userToken, groupId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await groupsData.getGroup(user.id, groupId)
        console.log(`Services-getGroup: userToken-${userToken}, groupId-${groupId}, group-${group}`)
        if (group) {
            return group
        }
        throw errors.NOT_FOUND(`Group ${groupId}`)
    }

    async function deleteGroup(userToken, groupId) {
        const user = await usersData.getUser(userToken)
        console.log(`Services-deleteGroup: userToken-${userToken}, groupId-${groupId}, user-${user}`)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        return groupsData.deleteGroup(user.id, groupId)
    }

    async function createGroup(userToken, groupToCreate) {
        const user = await usersData.getUser(userToken)
        console.log(`Services-createGroup: userToken-${userToken}, groupToCreate-${groupToCreate}, user-${user}`)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        if (!isAString(groupToCreate.title)) {
            throw errors.INVALID_PARAMETER('title')
        }
        if (!isAString(groupToCreate.description)) {
            throw errors.INVALID_PARAMETER('description')
        }
        return groupsData.createGroup(user.id, groupToCreate)
    }

    async function updateGroup(userToken, groupId, groupToCreate) {
        const user = await usersData.getUser(userToken)
        console.log(`Services-updateGroup: userToken-${userToken}, groupId-${groupId}, groupToUpdate-${groupToCreate}, user-${user}`)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        if (!isAString(groupToCreate.title)) {
            throw errors.INVALID_PARAMETER('title')
        }
        if (!isAString(groupToCreate.description)) {
            throw errors.INVALID_PARAMETER('description')
        }
        return groupsData.updateGroup(user.id, groupId, groupToCreate)
    }

    async function getMovies(userToken, q, skip=0, limit=MAX_LIMIT) {
        console.log(`Services-getMovies: userToken-${userToken}, q-${q}, skip-${skip}, limit-${limit}`)
        limit = Number(limit)
        skip = Number(skip)
        if (   isNaN(limit)
            || isNaN(skip)
            || skip > MAX_LIMIT
            || limit > MAX_LIMIT
            || (skip + limit) > MAX_LIMIT
            || skip  < 0
            || limit < 0
            ) {
                throw errors.INVALID_PARAMETER('skip or limit', `Skip and limit must be positive, less than ${MAX_LIMIT} and its sum must be less or equal to ${MAX_LIMIT}`)
        }

        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        return await moviesData.search(user.id, q, skip, limit)
    }

    async function getMovie(userToken, movieId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const movie = await moviesData.getMovieById(movieId)
        console.log(`Services-getMovie: userToken-${userToken}, movieId-${movieId}, user-${user}, movie-${movie}`)
        if (movie) {
            return movie
        }
        throw errors.NOT_FOUND(`Movie ${movieId}`)
    }

    async function deleteMovie(userToken, groupId, movieId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await groupsData.getGroup(user.id, groupId)
        if (!group) {
            throw errors.NOT_FOUND(`Group ${groupId}`)
        }
        const movie = await moviesData.getMovieById(movieId)
        console.log(`Services-deleteMovie: userToken-${userToken}, groupId-${groupId}, movieId-${movieId}, user-${user}, group-${group}, movie-${movie}`)
        if (!movie) {
            throw errors.NOT_FOUND(`Group ${groupId} has no movie ${movieId}`)
        }
        return groupsData.deleteMovie(user.id, groupId, movieId)        
    }

    async function addMovie(userToken, groupId, movieId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await groupsData.getGroup(user.id, groupId)
        if (!group) {
            throw errors.NOT_FOUND(`Group ${groupId}`)
        }
        console.log(`Services-addMovie: userToken-${userToken}, groupId-${groupId}, movieId-${movieId}, user-${user}, group-${group}`)
        return groupsData.addMovie(user.id, groupId, movieId)
    }

    async function createUser(name){
        console.log(`Services-createUser: userName-${name}`)
        if(name == undefined) {
            throw errors.INVALID_ARGUMENT("name")
        }
        return await usersData.createUser(name)
    }
}

// Auxiliary functions
function isAString(value) {
    return typeof value == 'string' && value != ""
}