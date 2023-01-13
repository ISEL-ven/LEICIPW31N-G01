// Module manages application users data.
// In this specific module, data is stored in memory

import errors from '../errors.mjs'
import crypto from 'crypto'

let users = [{id: 0, name: 'test', token: '8bf716e7-e3af-4343-93e0-9c6edb7b8005'}]
let nextUserId = 1

export async function createUser(userName, token) {
    let userToken = undefined
    if(token != undefined) {userToken = token}
    else {userToken = crypto.randomUUID()}

    //console.log(`CREATE NEW USER ${userName}--------------------------------------`)
    if (!userName) {
        throw errors.INVALID_PARAMETER(userName)
    }
    const newUser = {
        id: nextUserId++,
        name: userName,
        token: userToken
    }
    //console.log(`UsersDATA-createUser: user-${newUser.name}`)
    users.push(newUser)
    return newUser
}

export async function getUser(userToken) {
    const user =  users.find(user => user.token == userToken)
   // console.log(`UsersDATA: userToken-${userToken}, user-${user}`)
    if (!user) {
        throw errors.USER_NOT_FOUND('user')
    }
    return user
}

