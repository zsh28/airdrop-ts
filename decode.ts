import bs58 from 'bs58';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Your Base58-encoded private key from the environment variable
const base58Key = process.env.baseKey;

if (!base58Key) {
  console.error('Base58 key not found in environment variables.');
  process.exit(1);
}

// Decode the Base58 key to a Uint8Array
const secretKeyUint8Array = bs58.decode(base58Key);

// Convert the Uint8Array to an array of numbers and save to JSON
const secretKeyArray = Array.from(secretKeyUint8Array);
fs.writeFileSync('wba-wallet.json', JSON.stringify(secretKeyArray));

console.log('Private key saved to wba-wallet.json');
