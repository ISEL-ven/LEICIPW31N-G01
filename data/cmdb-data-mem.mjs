// Module manages application data.
// In this specific module, data is stored in memory

import {MAX_LIMIT} from '../services/services-constants.mjs'

const NUM_MOVIES = 250

let groups = new Array(MAX_LIMIT).fill(0, 0, MAX_LIMIT)
    .map((_, idx) => { 
        return {
            id: idx,
            title: `Task ${idx}`,
            description: `Task ${idx} description`
        } 
    })

let maxId = NUM_MOVIES

export async function getGroups() {
    return groups
}

export async function getGroup(groupId) {
    return groups.find(group => group.id == groupId)
}

export async function deleteGroup(groupId) {
    
    const groupIdx = groups.findIndex(group => group.id == groupId)
    if(groupIdx != -1) {
        groups.splice(groupIdx, 1)
        return true
    } 
    return false
}

export async function createGroup(groupToCreate) {
    let newGroup = {
        id: getNewId(), 
        title: groupToCreate.title,
        description: groupToCreate.description,
    }

    groups.push(newGroup)
    return newGroup
}

export async function updateGroup(groupId, newGroup) {
    const group = groups.find(group => group.id == groupId)
    if(group != undefined) {
        group.title = newGroup.title
        group.description = newGroup.description
        return group
    } 
}

function getNewId() {
    return maxId++
}
