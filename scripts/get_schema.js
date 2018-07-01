const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { buildClientSchema, introspectionQuery, printSchema } = require('graphql/utilities');
const URI = require('../app/constants/uri');

/**
 * localhost 주소로 인해 해당 코드 추가
 * https://github.com/bitinn/node-fetch/issues/19
 */
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false
})

const schemaPath = path.join(__dirname, '../scripts/schema');
const SERVER = URI.GRAPHQL_SERVER_URI;

fetch(SERVER, {
  agent: agent,
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: introspectionQuery }),
}, agent)
  .then(res => res.json())
  .then((schemaJSON) => {
    fs.writeFileSync(`${schemaPath}.json`, JSON.stringify(schemaJSON, null, 2));

    const graphQLSchema = buildClientSchema(schemaJSON.data);
    fs.writeFileSync(`${schemaPath}.graphql`, printSchema(graphQLSchema));
  });