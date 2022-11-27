// Module manages application data.
// In this specific module, data is stored in memory


import errors from '../errors.mjs'

let groups = []
let nextGroupId = 0

export async function getGroups() {
    console.log(`GroupsData-getGroups`)
    return groups
}

export async function getGroup(groupId) {
    console.log(`GroupsData-getGroup: groupId-${groupId}`)
    return groups.find(group => group.id == groupId)
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
    console.log(`GroupsData-createGroup: groupToCreate-${groupToCreate}`)
    let newGroup = {
        id: getNewId(), 
        title: groupToCreate.title,
        description: groupToCreate.description,
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

// TODO
// deleteMovie
// addMovie

// Auxiliary functions ---------------------------------------------------------
function getNewId() {
    return nextGroupId++
}
