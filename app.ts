import { Collection, MongoClient } from "mongodb";
import readline from "readline";

async function run(): Promise<void> {
  // Avoids an exception
  const client = new MongoClient(process.env.DB_CONNECTION_STRING as string);

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to database.");
  } catch (error) {
    console.log("Error connecting to database: " + error);
    return;
  }

  console.log("1. Get entries");
  console.log("2. Add new entry");
  console.log("3. Update entry");
  console.log("4. Delete entry");
  console.log();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("Welcome. Type a number to choose what to do: \n", async (answer) => {
    const database = client.db("sample_airbnb");
    if (parseInt(answer) === 1) {
      await getFirstTenEntries(database.collection("listingsAndReviews"));
    }
    rl.close();
    await client.close();
  });
}
run().catch(console.dir);

async function getFirstTenEntries(collection: Collection<Document>): Promise<void> {
  try {
    const entries = (await collection.find().toArray()).slice(0, 10);

    if (getFirstTenEntries !== null) {
      for (const entry of entries) {
        console.log("Id: " + entry._id);
        console.log("Name: " + entry.name);
        console.log("Summary: " + entry.summary);
        console.log("Monthly price: $" + entry.price);
        console.log("URL: " + entry.listing_url);
        console.log();
      }
    } else {
      console.log("Collection is empty.");
    }
  } catch (error) {
    console.log("Error getting all entries: " + error);
  }
}

async function addNewEntry(): Promise<void> {
}
