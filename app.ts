import { Collection, MongoClient, ObjectId } from "mongodb";

interface User {
  id?: ObjectId;
  name: string;
  joinDate: string;
}
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

  const prompt = require("prompt-sync")();

  const option = prompt("Welcome. Type a number to choose what to do: \n");

  const database = client.db("Users");

  const users = database.collection<User>("Users");

  if (option == 1) {
    await getFirstTenUsers(users);
    await client.close();
  } else if (option == 2) {
    const date = await inputNewUserData();
    await addNewUser(date, users);
    await client.close();
  } else if (option == 3) {
    
  }
  else if (option == 4) {
    const id = await prompt("User ID: ");
    await deleteUser(id, users);
    await client.close();
  }
}
run().catch(console.dir);

async function getFirstTenUsers(collection: Collection<User>): Promise<void> {
  try {
    // Get the first 10 entries
    const users = (await collection.find().toArray()).slice(0, 10);

    if (getFirstTenUsers !== null) {
      for (const user of users) {
        console.log(user);
        console.log();
      }
    } else {
      console.log("Collection is empty.");
    }
  } catch (error) {
    console.log("Error getting all users: " + error);
  }
}

async function addNewUser(user: User, collection: Collection<User>): Promise<void> {
  try {
    await collection.insertOne({
      name: user.name,
      joinDate: user.joinDate,
    });
    console.log("User added.");
  } catch (error) {
    console.log("Error adding new user: " + error);
  }
}

function inputNewUserData(): User {
  console.log();
  console.log("Add a new user.");
  console.log();

  const prompt = require("prompt-sync")();
  const name = prompt("Name: ");

  const user: User = {
    name: name,
    joinDate: new Date(Date.now()).toDateString(),
  };

  return user;
}

async function deleteUser(id: string, collection: Collection<User>) {
  try {
    await collection.deleteOne({ _id: new ObjectId(id) });
    console.log("User deleted.")
  } catch (error) {
    console.log("Error deleting user: " + error);
  }
}
