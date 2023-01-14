import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './elastic-constants.mjs'
import crypto from "node:crypto";


export default function () {
    const INDEX_NAME_USERS = 'users'
    const URI_MANAGER_USERS = uriManager(INDEX_NAME_USERS)

    return {
        createUser,
        getUser,
        getUserByGroupId
    }

    async function getUser(userToken, username) {
        const allUsers = await getAllUsers()
        let user = allUsers //just to initialize
        if (username) user = allUsers.find( (u) => { return u.username == username})
        if (userToken) user = allUsers.find( (u) => { return u.token == userToken})
        return user
    }

    async function getAllUsers() {
        const allInfo = await get(URI_MANAGER_USERS.getAll())
        const arrayWInfo = allInfo.hits.hits
        const allusers = arrayWInfo.map((it) => {return it._source})
        // console.log("inside ELASTIC")
        // console.log(allusers)
        return allusers
    }

    async function getUserByGroupId(id) {
        return get(URI_MANAGER_USERS.get(id))
            .then(createGroupFromElasticSendUser)
            
    }

    async function createUser(username, password) {
        //console.log("/n elastic - createUser/n")
        const newUser = {
            token: crypto.randomUUID() ,
            username: username ,
            password: password
        }
        return post(URI_MANAGER_USERS.create(), newUser)
            .then(() => { return newUser })
    }

    function createUserFromElastic(userElastic) {
        let user = userElastic._source
        user.id = userElastic._id
        return user
    }    
}