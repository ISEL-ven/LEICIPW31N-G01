export default {
    INVALID_PARAMETER: (argName, description) => {
        return {
            code: 1,
            message: `Invalid argument ${argName}`
        }
    },
    USER_NOT_FOUND: () => {
        return {
            code: 2,
            message: 'New year not found'
        }
    },
    NOT_FOUND: (argName) => {  // Group or Movie
        return {
            code: 3,
            message: `${argName} not found`
        }
    },
    INVALID_TOKEN: () => {
        return {
            code: 4,
            message: 'Invalid Token'
        }
    },
    NO_RESULTS: (argName) => {
        return {
            code: 5,
            message: `No results found with  ${argName} name`
        }
    }
}