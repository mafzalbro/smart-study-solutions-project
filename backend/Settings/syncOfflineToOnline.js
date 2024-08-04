const { MongoClient } = require('mongodb');

const LOCAL_URI = 'mongodb://localhost:27017/books-library';
const ONLINE_URI = 'mongodb://mafzalbro:mafzalbro@ac-hoyy6qy-shard-00-00.nxmhzyv.mongodb.net:27017,ac-hoyy6qy-shard-00-01.nxmhzyv.mongodb.net:27017,ac-hoyy6qy-shard-00-02.nxmhzyv.mongodb.net:27017/books_library?ssl=true&replicaSet=atlas-b4zf9f-shard-0&authSource=admin&retryWrites=true&w=majority&appName=AtlasCluster';

async function syncDatabases() {
  const localClient = new MongoClient(LOCAL_URI);
  const onlineClient = new MongoClient(ONLINE_URI);

  try {
    // Connect to local MongoDB
    await localClient.connect();
    console.log("Local DB Connected successfully...")
    const localDb = localClient.db();
    const localCollections = await localDb.listCollections().toArray();
    
    // Connect to online MongoDB
    await onlineClient.connect();
    console.log("Online DB Connected successfully...")
    const onlineDb = onlineClient.db();
    const onlineCollections = await onlineDb.listCollections().toArray();
    
    // Delete all collections in online MongoDB
    for (const collection of onlineCollections) {
      console.log(collection.name + "Dropded...")
      await onlineDb.collection(collection.name).drop();
    }
    
    // Sync data from local MongoDB to online MongoDB
    for (const collection of localCollections) {
      const localCollection = localDb.collection(collection.name);
      const data = await localCollection.find().toArray();
      
      const onlineCollection = onlineDb.collection(collection.name);
      console.log(collection.name + "Local getting added...")
      if (data.length > 0) {
        await onlineCollection.insertMany(data);
        console.log(collection.name + "Local getting added...")
      }
    }

    console.log('Data synchronized successfully.');

  } catch (error) {
    console.error('Error syncing databases:', error);
  } finally {
    await localClient.close();
    await onlineClient.close();
  }
}

syncDatabases();
