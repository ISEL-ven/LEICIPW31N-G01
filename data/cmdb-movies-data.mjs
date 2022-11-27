// Module manages application data from imdb database.
// In this specific module, data is online

import  fetch  from 'node-fetch'

import errors from '../errors.mjs'
import cache from './cache/movies.mjs'

const IMDB_API = '/k_a74padfu'
const IMDB_URL = 'https://imdb-api.com/en/API/'
const LIMIT = 250

// Fuctions that search cache first -------------------------------------------------------
export async function search(userId, q, skip, limit){
    if (limit == 0) limit = LIMIT
    if (q.length > 1) {
        const movies = cache.items.map(item => {if (item.title.includes(q)) return item}).filter(val => val != null)
        if (movies.length < 1) {
            return nameSearchExternal(q, limit)
        }
        if (limit > movies.length) {
            limit = movies.length
        }
        return movies.slice(0, limit)
    }
    
    const movies = cache.items
    checkQuantity(limit)
    if (movies.length == 0) {
        return top250moviesExternal(limit)            
    }
    return movies.slice(0, limit)
}  

export async function getMovieById(userId, id){
    const movie = cache.items.map(item => {if (item.id.localeCompare(id) == 0) return item}).filter(val => val != null)
    if (movie.length <1) {
        return getMovieByIdExternal(id)
    }
    return movie
}


// Fuctions that use IMDB API - external ----------------------------------------------------
async function top250moviesExternal(quantity){  // check if quantity > 250
    const movies = fetch(IMDB_URL+'top250movies'+IMDB_API)
    checkError(movies.errorMessage)
    cache.items += movies
    console.log(movies.items.slice(0, quantity))  // DEBUG LINE
    return movies.items.slice(0, quantity)
}

async function nameSearchExternal(name, quantity) {
    const movies = fetch(IMDB_URL+'SearchMovie'+IMDB_API+'/${name}')
    
    checkError(movies.errorMessage)
    const results = movies.results
    if (results.length < 1) {
        throw errors.NO_RESULTS(name)
    }
    cache.items += results
    if (quantity > results.length) {
        quantity = results.length
    }
    return movies.results.slice(0, quantity)
}

async function getMovieByIdExternal(id){
    const movie = fetch(IMDB_URL+'Title'+IMDB_API+id)
    checkError(movie.errorMessage)
    cache.items += movie
    return movie
}
    
// Auxiliary functions ------------------------------------------------
function checkQuantity(quantity) {
    if (quantity <= 0  || quantity > LIMIT) {
        throw errors.INVALID_PARAMETER('quantity', quantity)
    }
}

function checkError(error) {
    if (error.length > 1) {
        throw errors.INVALID_TOKEN()
    }
}