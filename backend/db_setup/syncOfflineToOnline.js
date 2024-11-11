const { MongoClient } = require("mongodb");
const { config } = require("dotenv");

config();

const LOCAL_URI = process.env.LOCAL_MONGODB_URI;
const ONLINE_URI = process.env.ONLINE_MONGODB_URI;

async function syncDatabases(collectionNames = []) {
  const localClient = new MongoClient(LOCAL_URI);
  const onlineClient = new MongoClient(ONLINE_URI);

  try {
    // Connect to local MongoDB
    await localClient.connect();
    console.log("Local DB Connected successfully...");
    const localDb = localClient.db();
    const localCollections = await localDb.listCollections().toArray();

    // Filter collections if a specific list is provided
    const collectionsToSync =
      collectionNames.length > 0
        ? localCollections.filter((collection) =>
            collectionNames.includes(collection.name)
          )
        : localCollections; // Sync all collections if no names provided

    const admin = localDb.collection("resources");
    const count = await admin.countDocuments();
    console.log({ admin_count: count });

    // Connect to online MongoDB
    await onlineClient.connect();
    console.log("Online DB Connected successfully...");
    const onlineDb = onlineClient.db();
    const onlineCollections = await onlineDb.listCollections().toArray();

    // Delete all collections in online MongoDB except 'users'
    for (const collection of onlineCollections) {
      if (collection.name === "users") continue; // Skip the 'users' collection
      console.log(collection.name + ": Online Dropped...");
      await onlineDb.collection(collection.name).drop();
    }

    // Sync data from local MongoDB to online MongoDB
    for (const collection of collectionsToSync) {
      const localCollection = localDb.collection(collection.name);
      const data = await localCollection.find().toArray();

      const onlineCollection = onlineDb.collection(collection.name);
      console.log(collection.name + ": Local data getting added...");

      if (data.length > 0) {
        await onlineCollection.insertMany(data);
        console.log(collection.name + ": Local data added successfully...");
      }
    }

    console.log("Data synchronized successfully.");
  } catch (error) {
    console.error("Error syncing databases:", error);
  } finally {
    await localClient.close();
    await onlineClient.close();
  }
}

// Example usage: sync only specific collections
const collectionsToSync = ["announcements"];
syncDatabases(collectionsToSync);
