"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // Avoids an exception
        const client = new mongodb_1.MongoClient(process.env.DB_CONNECTION_STRING);
        try {
            yield client.connect();
            yield client.db("admin").command({ ping: 1 });
            console.log("Successfully connected to database.");
        }
        catch (error) {
            console.log("Error connecting to database: " + error);
        }
        const database = client.db("sample_airbnb");
        const collection = database.collection("listingsAndReviews");
        try {
            const getAllEntries = (yield collection.find().toArray()).slice(0, 10);
            if (getAllEntries !== null) {
                for (const entry of getAllEntries) {
                    console.log(entry);
                    console.log();
                }
            }
            else {
                console.log("Collection is empty.");
            }
        }
        catch (error) {
            console.log("Error getting all entries: " + error);
        }
        finally {
            // Always closes the connection, even if an error occurred
            yield client.close();
        }
    });
}
run().catch(console.dir);
