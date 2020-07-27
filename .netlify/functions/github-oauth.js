const qs = require('querystring')
const https = require('https')

const config = {
  clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
}

exports.handler = function (event, context, callback) {
  const {githubCode} = JSON.parse(event.body)

  const params = qs.encode({
    'client_id': config.clientId,
    'client_secret': config.clientSecret,
    'code': githubCode
  })

  const request = https.request({
    hostname: 'github.com',
    path: '/login/oauth/access_token?' + params,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      callback(null, {
        statusCode: 200,
        body: data
      })
    });
  }).on('error', error => {
    callback(error)
  })

  request.write('')
  request.end()
}