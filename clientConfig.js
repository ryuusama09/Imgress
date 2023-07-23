import weaviate from 'weaviate-ts-client'
const client = weaviate.client({
    scheme: 'http',
    host: '34.229.70.140:8080',
});
module.exports = client