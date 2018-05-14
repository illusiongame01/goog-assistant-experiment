const https = require('https')

class SyncHttps {
    /**
     * Synclonious https call
     * @param {RequestOptions} httpsOptions 
     * @returns {Promise}
     */
    static getJSON(httpsOptions) {
        return new Promise((resolve, reject) => {
            https.get(httpsOptions, (res) => {
                let data = ''
                res.on('data', (chunk) => { data += chunk })

                res.on('end', () => {
                    resolve(JSON.parse(data))
                })
            }).on('error', (e) => reject(e))
        })
    }
}

module.exports = SyncHttps