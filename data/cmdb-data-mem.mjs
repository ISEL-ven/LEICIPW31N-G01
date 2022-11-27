// Module manages application data.
// In this specific module, data is stored in memory


import errors from '../errors.mjs'

let groups = []
let nextGroupId = 0

export default function(){
    return  {
        getGroup : getGroup,
        getGroups : getGroups,
        deleteGroup : deleteGroup,
        createGroup : createGroup,
        updateGroup : updateGroup
    }

    async function getGroups() {
        return groups
    }

    async function getGroup(groupId) {
        return groups.find(group => group.id == groupId)
    }

    async function deleteGroup(groupId) {
    
        const groupIdx = groups.findIndex(group => group.id == groupId)
        if(groupIdx != -1) {
            groups.splice(groupIdx, 1)
            return true
        } 
        return false
    }

    async function createGroup(groupToCreate) {
        let newGroup = {
            id: getNewId(), 
            title: groupToCreate.title,
            description: groupToCreate.description,
        }
    
        groups.push(newGroup)
        return newGroup
    }

    async function updateGroup(groupId, newGroup) {
        const group = groups.find(group => group.id == groupId)
        if(group != undefined) {
            group.title = newGroup.title
            group.description = newGroup.description
            return group
        } 
    }
}

// Auxiliary functions ---------------------------------------------------------
function getNewId() {
    return nextGroupId++
}
