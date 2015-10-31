'use strict'

let test = require('tape')
let nock = require('nock')
let Siteleaf = require('..')

const ENDPOINT = 'https://api.siteleaf.com'

test('Module', (t) => {
  t.plan(2)
  t.true(typeof Siteleaf === 'function', 'is function')
  t.true(/^\s*class\s+/.test(Siteleaf.toString()), 'is class')
})

test('Class', (t) => {
  t.plan(1)
  let client = new Siteleaf()
  t.true(client instanceof Siteleaf, 'is instantiable')
})

test('Instance', (t) => {
  t.plan(7)
  let client = new Siteleaf()
  t.true(typeof client.config !== 'undefined', 'config exists')
  t.equal(client.config.apiKey, null, 'config.apiKey exists')
  t.equal(client.config.apiSecret, null, 'config.apiSecret exists')
  t.equal(client.config.endpoint, ENDPOINT, 'config.endpoint exists')
  t.equal(client.config.version, 'v1', 'config.version exists')
  t.true(Array.isArray(client.config.methods), 'config.methods is an array')
  t.equal(
    client.config.methods.join(','),
    'delete,get,post,put',
    'all config.methods exist'
  )
})

test('Instance', (t) => {
  t.plan(3)
  let client = new Siteleaf({
    apiKey: 'foo',
    apiSecret: 'bar',
    foo: 'bar'
  })
  t.equal(client.config.apiKey, 'foo', 'config.apiKey can be overriden')
  t.equal(client.config.apiSecret, 'bar', 'config.apiSecret can be overriden')
  t.equal(client.config.foo, 'bar', 'custom configrations can be passed')
})

test('Instance', (t) => {
  let client = new Siteleaf()
  t.plan(client.config.methods.length)

  client.config.methods.forEach((method) => {
    t.true(
      typeof client[method] === 'function',
      `has ${method} convenience method`
    )
  })
})

test('Instance', (t) => {
  t.plan(1)
  let client = new Siteleaf()
  t.true(
    typeof client._buildEndpoint !== 'undefined',
    `has _buildEndpoint method`
  )
})

test('_buildEndpoint', (t) => {
  t.plan(1)
  let client = new Siteleaf()

  t.equal(
    client._buildEndpoint('sites'),
    `${ENDPOINT}/v1/sites`,
    'creates valid url'
  )
})

test('Instance', (t) => {
  t.plan(1)
  let client = new Siteleaf()
  t.true(typeof client._request !== 'undefined', 'has _request method')
})

test('_request', (t) => {
  t.plan(2)
  let client = new Siteleaf()

  client._request('get', 'sites', (error, response) => {
    t.true(error, 'missing api secret returns error object')
    t.equal(error.message, 'Missing API key', 'fails when api key is missing')
    t.end()
  })
})

test('_request', (t) => {
  t.plan(2)
  let client = new Siteleaf({
    apiKey: 'xxx'
  })

  client._request('get', 'sites', (error, response) => {
    t.true(error, 'missing api secret returns error object')
    t.equal(
      error.message,
      'Missing API secret',
      'fails when api secret is missing'
    )
    t.end()
  })
})

test('_request', (t) => {
  nock(ENDPOINT).get('/v1/sites').reply(200, [])

  t.plan(3)
  let client = new Siteleaf({
    apiKey: 'xxx',
    apiSecret: 'xxx'
  })

  client._request('get', 'sites', (error, response) => {
    t.false(error, 'valid requests do not return error objects')
    t.true(response, 'valid requests return response objects')
    t.true(
      Array.isArray(response),
      'valid requests do not return proper data types'
    )
    t.end()
  })
})

test('_request responds with error', (t) => {
  nock(ENDPOINT).post('/v1/sites').replyWithError('Error')

  t.plan(1)
  let client = new Siteleaf({
    apiKey: 'xxx',
    apiSecret: 'xxx'
  })

  client._request('post', 'sites', (error, response) => {
    t.true(error, 'invalid requests return error objects')
    t.end()
  })
})

test('_request api responds with error', (t) => {
  nock(ENDPOINT).get('/v1/sites/123').reply(200, {error: true})

  t.plan(3)
  let client = new Siteleaf({
    apiKey: 'xxx',
    apiSecret: 'xxx'
  })

  client._request('get', 'sites/123', (error, response) => {
    t.false(error, 'invalid api requests do not return error objects')
    t.true(response, 'invalid api requests return response objects')
    t.true(
      typeof response.error !== 'undefined',
      'invalid api requests responses contain an error property'
    )
    t.end()
  })
})
