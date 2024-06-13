import { Collection, MongoClient } from "mongodb";
import prompt from "prompt-sync";

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

  console.log("Welcome. Type a number to choose what to do:");
  console.log("1. Get entries");
  console.log("2. Add new entry");
  console.log("3. Update entry");
  console.log("4. Delete entry");
  console.log();

  prompt.start();
  prompt.get(["option"]),
    async (error: any, result: any) => {
      const database = client.db("sample_airbnb");
      
      await console.log(result.option)
      if (result.option == 1) {
        await getFirstTenEntries(database.collection("listingsAndReviews"));
      } else if (parseInt(result.option) === 2) {
        let date = inputNewEntryData();
        addNewEntry();
      }
    };
  await client.close();
}
run().catch(console.dir);

async function getFirstTenEntries(collection: Collection<Document>): Promise<void> {
  try {
    // Get the first 10 entries
    const entries = (await collection.find().toArray()).slice(0, 10);

    if (getFirstTenEntries !== null) {
      for (const entry of entries) {
        console.log(entry);
        console.log();
      }
    } else {
      console.log("Collection is empty.");
    }
  } catch (error) {
    console.log("Error getting all entries: " + error);
  }
}

async function addNewEntry(): Promise<void> {}

function inputNewEntryData(): string {
  console.log();
  console.log("Add a new entry.");
  console.log();
  console.log("Date:");

  prompt.start();
  prompt.get(["date"]),
    (error: any, result: any) => {
      return result.date;
    };
  return "";
}
