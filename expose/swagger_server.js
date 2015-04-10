var swagger = require('swagger-framework');

var host = process.env.IP || '127.0.0.1';
var port = process.env.PORT || 8000;
var url = 'http://' + host + ':' + port;

var framework = swagger.Framework({ basePath: url });

var api = framework.api({
  path: '/lightstream',
  description: 'Manage lights',
  consumes: ['application/json'],
  produces: ['application/json'],
});

var resource = api.resource({ path: '/lightstream/{lightId}' });

var operation = resource.operation(
  {
    method: 'GET',
    summary: 'Find light node by ID',
    notes: 'Returns a light node based on ID',
    type: 'LightStream',
    nickname: 'getLightById',
    parameters: [
      {
        name: 'lightId',
        description: 'ID of light node that needs to be fetched',
        required: true,
        type: 'integer',
        paramType: 'path',
        minimum: '1',
        maximum: '100000',
      },
    ],
    responseMessages: [
      {
        code: 400,
        message: 'Invalid ID supplied',
      },
      {
        code: 404,
        message: 'Light node not found',
      },
    ],
  },
  function(req, res) {
    res.sf.reply(200, {
      message: 'Light Node id ' + req.sf.path.lightId,
    });
  }
);

api.model({
  id: 'Light',
  required: ['id', 'name'],
  properties: {
    id: {
      type: 'integer',
      description: 'unique identifier for the light node',
      minimum: '0',
      maximum: '100',
    },
    name: {
      type: 'string'
    },
    photoUrls: {
      type: 'array',
      items: { type: 'string' },
    },
    status: {
      type: 'string',
      description: 'light status in the store',
      enum: ['available', 'pending', 'sold'],
    },
  },
});

if (module.parent) {
  module.exports = framework;
} else {
  framework.server().listen(port, host, function(err) {
    if (err) throw err;

    console.log('Server started ' + url + '/');
  });
}