'use strict'

let extend = require('util')._extend
let pkg = require('../package.json')
let querystring = require('querystring')
let request = require('superagent')

/**
 * @class Siteleaf
 */
class Siteleaf {

  /**
   * Construtor method
   * @param  {Object} config Instance configuration options
   */
  constructor (config) {
    let self = this
    this.config = extend(
      {
        apiKey: process.env.SITELEAF_API_KEY || null,
        apiSecret: process.env.SITELEAF_API_SECRET || null,
        endpoint: process.env.SITELEAF_API_ENDPOINT || 'https://api.siteleaf.com',
        methods: ['delete', 'get', 'post', 'put'],
        version: process.env.SITELEAF_API_VERSION || 'v1'
      },
      config
    )

    // Create convenience instance methods for HTTP methods.
    self.config.methods.forEach((method) => {
      self[method] = (path, params, callback) => {
        self._request(method, path, params, callback)
      }
    })

    return this
  }

  /**
   * Helper method for building endpoint url's
   * @param  {String}  path  url request path
   * @return {String}  Prepared endpoint url
   */
  _buildEndpoint (path) {
    let config = this.config
    return `${config.endpoint}/${config.version}${path.replace(/^\/?/, '/')}`
  }

  /**
   * HTTP request method
   * @param  {String}   method   request method
   * @param  {String}   path     Siteleaf path
   * @param  {Object}   params   request parameters
   * @param  {Function} callback callback function
   */
  _request (method, path, params, callback) {
    let body = {}
    let url = this._buildEndpoint(path)
    let headers = {
      Accept: 'application/json',
      'User-Agent': `${pkg.name}/${pkg.version}`
    }

    // If callback function is passed as params argument,
    // set callback equal to the function in params
    callback = (typeof params === 'function') ? params : callback

    if (typeof this.config.apiKey !== 'string') {
      return callback(new Error('Missing API key'))
    }

    if (typeof this.config.apiSecret !== 'string') {
      return callback(new Error('Missing API secret'))
    }

    method = method.toLowerCase()

    if (method === ('post' || 'put')) {
      body = params
    } else {
      url += `?${querystring.stringify(params)}`
    }

    // Make http request
    request[method](url)
      .send(body)
      .auth(this.config.apiKey, this.config.apiSecret)
      .set(headers)
      .end((err, res) => {
        // Superagent error
        if (err) {
          return callback(err)
        }
        // Error in Siteleaf API response
        if (res.error) {
          return callback(new Error(res.error))
        }
        return callback(null, res.body)
      })
  }
}

module.exports = Siteleaf
