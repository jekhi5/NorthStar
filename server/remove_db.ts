import mongoose from 'mongoose';

// Pass URL of your mongoDB instance as first argument
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Clears all collections from the connected MongoDB database.
 *
 * @returns A Promise that resolves when the database has been cleared.
 */
const clearDatabase = async (): Promise<void> => {
  try {
    // Wait for the connection to be established
    await mongoose.connection.once('open', async () => {
      // Clear each collection
      await db.dropDatabase();

      console.log('Database cleared');
      if (db) db.close();
    });
  } catch (err) {
    console.log('ERROR: ' + err);
    if (db) db.close();
  }
};

clearDatabase()
  .then(() => {
    console.log('Processing complete');
  })
  .catch(err => {
    console.log('ERROR: ' + err);
  });

console.log('Processing ...');
