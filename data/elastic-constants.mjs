const URI='http://localhost:9200/'


export default function(index) {
    return {
        getAll: () => `${URI}${index}/_search`,
        get: (id) => `${URI}${index}/_doc/${id}`,
        create: () => `${URI}${index}/_doc/?refresh=wait_for`,
        addTo: (id) => `${URI}${index}/_update/${id}?refresh=wait_for`,
        update: (id) => `${URI}${index}/_doc/${id}?refresh=wait_for`,
        delete: (id) => `${URI}${index}/_doc/${id}?refresh=wait_for`
    }
}
