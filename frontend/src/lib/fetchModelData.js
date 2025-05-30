/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
function fetchModel(url, options = {}) {
    return fetch("http://localhost:8081" + url, { credentials: "include", ...options })
        .then((response) => response.json());
}

export default fetchModel;