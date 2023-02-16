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
        getGroups: getGroups,                // groups from user
        getGroup: getGroup,                  // especific group 
        getGroupsWeb: getGroupsWeb,
        updateGroup: updateGroup,            // group name, etc
        deleteGroup: deleteGroup,            // remove group from user
        createGroup: createGroup,            // add new group to user
        createGroupWeb: createGroupWeb,
        getMovies: getMovies,                // search movies
        getMovie: getMovie,                  // get especific movie
        deleteMovie: deleteMovie,            // remove movie from group
        addMovie: addMovie,                  // add movie to group
        getMoviesByName: getMoviesByName,
        getMovieDetails: getMovieDetails,
        getUser: getUser,
        createUser : createUser,             // add user
        createWebUser: createWebUser
    }

    async function getUser (username, password) {
        const user = await usersData.getUser(username)
        
        if (user.password == password) return user    //if user is undefined if loop is false
    }

    async function getGroupsWeb(userName, q, skip=0, limit=MAX_LIMIT) {
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
            return groupsData.getGroups(userName, q, skip, limit)
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

        const user = await usersData.getUser(userToken.username)
        console.log(user)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }

        return groupsData.getGroups(userToken, q, skip, limit)
    }

    async function getGroup(userToken, groupId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }

        const group = await groupsData.getDetailsFromGroup(groupId)
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

        return groupsData.deleteGroup(groupId)
    }

    async function createGroup(userToken, groupToCreate) {
        const user = await usersData.getUser(userToken)
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

    async function createGroupWeb(username, groupToCreate) {
        const user = await usersData.getUser(username)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        if (!isAString(groupToCreate.title)) {
            throw errors.INVALID_PARAMETER('title')
        }
        if (!isAString(groupToCreate.description)) {
            throw errors.INVALID_PARAMETER('description')
        }

        return groupsData.createGroup(username, groupToCreate)
    }

    async function updateGroup(userToken, groupId, groupToCreate) {
        const user = await usersData.getUser(userToken)
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

    async function getMoviesByName(userToken, q, skip=0, limit=MAX_LIMIT) {
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
        if (movie) {
            return movie
        }

        throw errors.NOT_FOUND(`Movie ${movieId}`)
    }

    async function getMovieDetails(userToken, movieId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const movie = await moviesData.getMovieById(movieId)
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
        const group = await groupsData.getDetailsFromGroup(groupId)
        if (!group) {
            throw errors.NOT_FOUND(`Group ${groupId}`)
        }
        
        return groupsData.deleteMovie(user.id, groupId, movieId)        
    }

    async function addMovie(userToken, groupId, movieId) {
        const user = await usersData.getUser(userToken)
        if (!user) {
            throw errors.USER_NOT_FOUND()
        }
        const group = await groupsData.getDetailsFromGroup(groupId)
        if (!group) {
            throw errors.NOT_FOUND(`Group ${groupId}`)
        }

        return await groupsData.addMovie(user.id, groupId, movieId)
    }

    async function createUser(name){
        if(name == undefined) {
            throw errors.INVALID_ARGUMENT("name")
        }

        return await usersData.createUser(name)
    }

    async function createWebUser(name, password){
        if(name == undefined) {
            throw errors.INVALID_ARGUMENT("name")
        }
        if(password == undefined) {
            throw errors.INVALID_ARGUMENT("password")
        }

        return await usersData.createUser(name, password)
    }
}

// Auxiliary functions
function isAString(value) {
    return typeof value == 'string' && value != ""
}
