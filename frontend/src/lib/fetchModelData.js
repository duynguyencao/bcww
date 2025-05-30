/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
function fetchModel(url) {
    return fetch("http://localhost:8081" + url).then((response) =>
        response.json()
    );
}

export default fetchModel;