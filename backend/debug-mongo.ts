import { MongoMemoryServer } from 'mongodb-memory-server';

async function test() {
  try {
    console.log('Attempting to start MongoMemoryServer...');
    const mongoServer = await MongoMemoryServer.create();
    console.log('Success! URI:', mongoServer.getUri());
    await mongoServer.stop();
  } catch (err) {
    console.error('Failed to start MongoMemoryServer:');
    console.error(err);
    process.exit(1);
  }
}

test();
