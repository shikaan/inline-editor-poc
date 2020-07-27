const qs = require('querystring')
const https = require('https')

exports.handler = function (event, context, callback) {
  const {githubCode} = event

  // TODO: refresh these credentials!
  const params = qs.encode({
    'client_id': '6587b38646374a039ebc',
    'client_secret': '79c1aa5b06490a64ced31b8a4060f161facf4c77',
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

    console.log('Status Code:', res.statusCode);

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
}