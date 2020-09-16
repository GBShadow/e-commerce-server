const { MongoClient } = require('mongodb')
const url = require('url')

let cachedDb = null

async function connectToDatabase(uri) {
  if(cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const dbName = url.parse(uri).pathname.substr(1)
  
  const db = client.db(dbName)

  cachedDb = db

  return db
}

exports.handler = async () => {

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('products')


  return collection.find()
  .then(response => response.json())
  .then(data => ({
    statusCode: 200,
    body: data.products
  }))
}