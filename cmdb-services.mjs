// Module contains all CMDB management logic

import * as memData from './cmdb-data-mem.mjs'
import * as imdbData from '/cmdb-movies-data.mjs'


export async function getTasks() {
    return memData.getTasks()
}

export async function getTask(taskId) {
    // Validate taskId
    return memData.getTask(taskId)
}

export async function deleteTask(taskId) {
    // Validate taskId
    return memData.deleteTask(taskId)
}

export async function createTask(taskToCreate) {
    // Validate new task properties
    if(!isAString(taskToCreate.title))
        throw "Invalid Argument"
    
    return memData.createTask(taskToCreate)
}

export async function updateTask(taskId, taskToCreate) {
    // Validate new task properties
    if(!isAString(taskToCreate.title))
        throw "Invalid Argument"

    return memData.updateTask(taskId, taskToCreate)
}


// Auxiliary functions

function isAString(value) {
    return typeof value == 'string' && value != ""

}