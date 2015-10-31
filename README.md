<img src="https://futureofwebdesign.com/new-york-2010/images/content/logo_siteleaf_new.png" width="40" />
### Node.js SDK

An unofficial API wrapper library for interacting with the [Siteleaf](https://github.com/siteleaf/siteleaf-api).

[![wercker status](https://app.wercker.com/status/8a942ddc12e6499c8ac0e58dac9e6ebe/s/master "wercker status")](https://app.wercker.com/project/bykey/8a942ddc12e6499c8ac0e58dac9e6ebe) [![npm/siteleaf-sdk](https://nodei.co/npm/siteleaf-sdk.png?mini=true)](https://www.npmjs.com/package/siteleaf-sdk)

```javascript
let siteleaf = new Siteleaf({
  apiKey: 'xxx',
  apiSecret: 'xxx'
})

siteleaf.get('sites', (error, sites) => {
  console.log(sites) // My sites!
})
```

#### Requirements

* Node.js >= 4.x

#### Installation

`npm install siteleaf-sdk`

#### Getting Started

You will need an API key and secret token to get started.  You can find this in your [Siteleaf account dashboard](https://manage.siteleaf.com/account).

````javascript
// Require the library
let Siteleaf = require('siteleaf')

// Create a new instance using your api key and secret
let siteleaf = new Siteleaf({
  apiKey: process.env.SITELEAF_API_KEY,
  apiSecret: process.env.SITELEAF_API_SECRET,
})
````
For a full list of configuration options see: [Configuration](#configuration)

##### Making requests

You are now ready to make API requests.  To do so, use one of the convenience methods from your instance:

````javascript
siteleaf.delete()
siteleaf.get()
siteleaf.post()
siteleaf.put()
````

Simply pass the path, optional parameters and a callback function.

```javascript

// List all users
siteleaf.post('users', (error, response) => {
  console.log(error, response)
})

// Create a new site
let site = {title: 'My new site', domain: 'example.com'}
siteleaf.post('sites', site, (error, response) => {
  console.log(error, response)
})

```

For a full list of all available API methods see: https://github.com/siteleaf/siteleaf-api

#### Configuration

Config | Environment Variable | Description | Default
---|---|---|---
apiKey|`SITELEAF_API_KEY`|API Key|`null`
apiSecret|`SITELEAF_API_SECRET`|API Secret|`null`
endpoint|`SITELEAF_API_ENDPOINT`|API Endpoint|https://api.siteleaf.com
version|`SITELEAF_API_VERSION`|API Version|v1
methods| |Available rest methods|`['delete', 'get', 'post', 'put']`

#### Development

##### Commands

Name | Command | Description
---|---|---
Lint|`npm run lint`|Runs the [Standard](https://github.com/feross/standard) code linter over the codebase
Pretest|`npm pretest`|An alias for `lint`
Test|`npm test`|Runs the test suite
