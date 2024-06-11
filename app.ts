import { MongoClient } from "mongodb";

async function run(): Promise<void> {
  // Avoids an exception
  const client = new MongoClient(process.env.DB_CONNECTION_STRING as string);

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to database.");
  } catch (error) {
    console.log("Error connecting to database: " + error);
  }

  const database = client.db("sample_airbnb");
  const collection = database.collection("listingsAndReviews");

  try {
    const getAllEntries = (await collection.find().toArray()).slice(0, 10);

    if (getAllEntries !== null) {
      for (const entry of getAllEntries) {
        console.log(entry);
        console.log();
      }
    } else {
      console.log("Collection is empty.");
    }
  } catch (error) {
    console.log("Error getting all entries: " + error);
  } finally {
    // Always closes the connection, even if an error occurred
    await client.close();
  }
}

run().catch(console.dir);
