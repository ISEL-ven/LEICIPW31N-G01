// Module contains all CMDB management logic

//import * as memData from './data/cmdb-data-mem.mjs'
//import * as imdbData from '/data/cmdb-movies-data.mjs'
import {MAX_LIMIT} from './services-constants.mjs'
import errors from '../errors.mjs'

export default function(groupsData, usersData, moviesData) {
    if (!groupsData) {
        throw errors.INVALID_PARAMETER('groupsData')
    }
    if (!usersData) {
        throw errors.INVALID_PARAMETER('usersData')
    }
    if (!moviesData) {
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
        if (group) {
            return group
        }
        throw errors.NOT_FOUND(`Group ${groupId}`)
    }

    async function deleteGroup(userToken, groupId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        return groupsData.deleteGroup(user.id, groupId)
    }

    async function createGroup(userToken, groupToCreate) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        if (!isAString(groupToCreate.title)) {
            throw errors.INVALID_PARAMETER('title')
        }
        if (!isAString(taskToCreate.description)) {
            throw errors.INVALID_PARAMETER('description')
        }
        return groupsData.createGroup(user.id, groupToCreate)
    }

    async function updateGroup(userToken, groupId, groupToCreate) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        if (!isAString(taskToCreate.title)) {
            throw errors.INVALID_PARAMETER('title')
        }
        if (!isAString(taskToCreate.description)) {
            throw errors.INVALID_PARAMETER('description')
        }
        return groupsData.updateGroup(user.id, groupId, groupToCreate)
    }

    async function getMovies(userToken, q, skip=0, limit=MAX_LIMIT) {
        console.log('entering getMovies Services ' +q)
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
        console.log(user)
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
        console.log(movieId)
        const movie = await moviesData.getMovieById(user.id, movieId)
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
        const movie = await moviesData.getMovie(user.id, groupId, movieId)
        if (!movie) {
            throw errors.NOT_FOUND(`Group ${groupId} has no movie ${movieId}`)
        }
        return moviesData.deleteMovie(user.id, groupId, movieId)        
    }

    async function addMovie(userToken, groupId, movieId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await memData.getGroup(user.id, groupId)
        if (!group) {
            throw errors.NOT_FOUND(`Group ${groupId}`)
        }
        return memData.addMovie(user.id, groupId, movieId)
    }

    async function createUser(name){
        console.log('createUserService: ' +name)
        if(name == undefined) {
            throw errors.INVALID_ARGUMENT("name")
        } 
        const final = await usersData.createUser(name)
        console.log(final)
        return final
    }
}

// Auxiliary functions
function isAString(value) {
    return typeof value == 'string' && value != ""
}
