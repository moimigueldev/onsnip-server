var mcache = require('memory-cache');


// This is the code to cahce response to server for 16 secs, which is the max
const cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        // console.log('cached-boyd', cachedBody)
        if (cachedBody) {
            res.send(cachedBody)
            return null
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            return next()
        }
    }
}


module.exports = cache

