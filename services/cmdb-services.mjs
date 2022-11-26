// Module contains all CMDB management logic

//import * as memData from './data/cmdb-data-mem.mjs'
//import * as imdbData from '/data/cmdb-movies-data.mjs'
import {MAX_LIMIT} from './services-constants'
import errors from '../errors'

export default function(moviesData, userData) {
    if (!moviesData) {
        throw errors.INVALID_PARAMETER('moviesData')
    }
    if (!userData) {
        throw errors.INVALID_PARAMETER('userData')
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
        addMovie: addMovie        // add movie to group
    }

    async function getGroups(userToken, q, skip=0, limit=MAX_LIMIT) {
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

        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        return memData.getGroups(user.id, q, skip, limit)
    }

    async function getGroup(userToken, groupId) {
        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await memData.getGroup(user.id, groupId)
        if (group) {
            return group
        }
        throw errors.NOT_FOUND(`Group ${groupId}`)
    }

    async function deleteGroup(userToken, groupId) {
        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await memData.getGroup(user.id, groupId)
        if (group) {
            return memData.deleteGroup(user.id, groupId)
        }
        throw errors.NOT_FOUND(`Group ${groupId}`)
    }

    async function createGroup(userToken, groupToCreate) {
        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        if (!isAString(taskToCreate.name)) {
            throw errors.INVALID_PARAMETER('name')
        }
        if (!isAString(taskToCreate.description)) {
            throw errors.INVALID_PARAMETER('description')
        }
        return memData.createGroup(user.id, groupToCreate)
    }

    async function updateGroup(userToken, groupId, groupToCreate) {
        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        if (!isAString(taskToCreate.name)) {
            throw errors.INVALID_PARAMETER('name')
        }
        if (!isAString(taskToCreate.description)) {
            throw errors.INVALID_PARAMETER('description')
        }
        return memData.updateGroup(user.id, groupId, groupToCreate)
    }

    async function getMovies(userToken, q, skip=0, limit=MAX_LIMIT) {
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

        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        return memData.getMovies(user.id, q, skip, limit)
    }

    async function getMovie(userToken, movieId) {
        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const movie = await memData.getMovie(user.id, movieId)
        if (movie) {
            return movie
        }
        throw errors.NOT_FOUND(`Movie ${movieId}`)
    }

    async function deleteMovie(userToken, groupId, movieId) {
        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await memData.getGroup(user.id, groupId)
        if (!group) {
            throw errors.NOT_FOUND(`Group ${groupId}`)
        }
        const movie = await memData.getMovie(user.id, groupId, movieId)
        if (!movie) {
            throw errors.NOT_FOUND(`Group ${groupId} has no movie ${movieId}`)
        }
        return memData.deleteMovie(user.id, groupId, movieId)        
    }

    async function addMovie(userToken, groupId, movieId) {
        const user = await userData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await memData.getGroup(user.id, groupId)
        if (!group) {
            throw errors.NOT_FOUND(`Group ${groupId}`)
        }
        return memData.addMovie(user.id, groupId, movieId)
    }
}

// Auxiliary functions

function isAString(value) {
    return typeof value == 'string' && value != ""
}