// Module that contains the functions that handle all HTTP Site requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoque the corresponding operation on services
//  - Generate the response in HTML format


//import * as cmdbServices from  '../../services/cmdb-services.mjs' já estava comentado

//import toHttpResponse from './response-errors.mjs'

export default function (services) {
    // validate argument -----------------------------
    if (!services) {
        console.log('Web-api: services is missing!')
        throw errors.INVALID_PARAMETER('services')
    }
    return {
        getGroup: handleRequest(getGroup)
    }

    function getGroup(req, rsp) {
        const groupId = req.params.id
        const group = services.getGroup(req.token, groupId)
        rsp.send('test')
    }


     // Auxiliary functions ----------------------------------------------------------------
     function handleRequest(handler) {
        return async function (req, rsp) {
            req.token = 'TODO: martelar token'
               
            try {
                await handler(req, rsp)
            } catch (e) {
                const response = toHttpResponse(e)
                rsp.status(response.status).json({ error: response.body })
                console.log(e)
            }
        }
    }
}
