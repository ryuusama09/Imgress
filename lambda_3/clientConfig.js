import weaviate from 'weaviate-ts-client'
import 'dotenv/config'
const client = weaviate.client({
    scheme: 'http',
    host: process.env.WEAVIATE_HOST,
});
export default client