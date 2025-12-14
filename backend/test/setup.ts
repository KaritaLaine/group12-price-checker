import { beforeAll, afterAll, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
process.env.REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});
