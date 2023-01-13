// Module manages application data from imdb database.
// In this specific module, data is online

import  fetch, { Response }  from 'node-fetch'
import errors from '../errors.mjs'
import cache from './cache/movies.mjs'

const IMDB_API = '/k_u6iexz6v' //k_j9ceqbwy, k_a74padfu, k_u6iexz6v'
const IMDB_URL = 'https://imdb-api.com/en/API/'
const LIMIT = 250


// Fuctions that search cache first -------------------------------------------------------
export async function search(userId, q, skip, limit){
    console.log(`moviesDATA-search: userId-${userId}, q-${q}, skip-${skip}, limit-${limit}`)
    if (limit == 0) limit = LIMIT
    if (q) {
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

export async function getMovieById(id){    
    console.log(`moviesDATA-getMovieById: movieId-${id}`)
    return getMovieByIdExternal(id)
    const movie = cache.items.find(movie => movie.id == id) //gets movie specified from cache
    if (!movie) {   //if not in cache gets movie from "EXTERNAL"
        console.log("getting from API ")
        return getMovieByIdExternal(id)
    }
    return movie
}

// Fuctions that use IMDB API - external ----------------------------------------------------
async function top250moviesExternal(quantity){
    //console.log(`MoviesData-top250: search in external IMDB, quantity-${quantity}`)
    const movies = await fetch(IMDB_URL+'top250movies'+IMDB_API)
    checkError(movies.errorMessage)
    movies.array.forEach(element => {
        cache.items.push(element)
    });
    return movies.items.slice(0, quantity)
}

async function nameSearchExternal(name, quantity) {
    return cache.items.slice(0, 6)  // to use internal cache movies
    console.log(`MoviesData-searchByName: search in external IMDB, name-${name},  quantity-${quantity}`)
    const rsp = await fetch(`${IMDB_URL}SearchMovie${IMDB_API}/${name}`)
    const body = await rsp.text()
    const movies = JSON.parse(body)
    checkError(movies.errorMessage)
    const results = movies.results
    if (results == undefined) {
        throw errors.NO_RESULTS(name)
    }
    results.forEach(element => {
        cache.items.push(element)
    });
    if (quantity > results.length) {
        quantity = results.length
    }
    return movies.results.slice(0, quantity)
}

export async function getMovieByIdExternal(id){
    //console.log(`MoviesData-searchById: search in external IMDB, id-${id}`)
    const rsp = await fetch(IMDB_URL+'Title'+IMDB_API+'/'+id)
    const body = await rsp.text()
    const movie = JSON.parse(body)
    checkError(movie.errorMessage)
    cache.items.push(movie) 
    return movie
}
    
// Auxiliary functions ------------------------------------------------
function checkQuantity(quantity) {
    if (quantity <= 0  || quantity > LIMIT) {
        throw errors.INVALID_PARAMETER('quantity', quantity)
    }
}

function checkError(error) {
    if (!error) return
    if (error.length > 1) {
        throw errors.INVALID_TOKEN()
    }
}