import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const Public_Key = process.env.PUBLIC_KEY;

// Check if the PUBLIC_KEY environment variable is defined
if (!Public_Key) {
  throw new Error("Missing PUBLIC_KEY environment variable");
}

// Import our dev wallet keypair from the wallet file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our WBA public key
const to = new PublicKey(Public_Key);

// Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    // Get balance of dev wallet
    const balance = await connection.getBalance(from.publicKey);
    console.log(`Current balance: ${balance} lamports`);

    // Create a test transaction to calculate fees
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance, // Temporarily set to full balance
      })
    );

    // Fetch the latest blockhash
    const latestBlockhash = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = from.publicKey;

    // Calculate the exact fee rate to transfer entire SOL amount minus fees
    const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;
    console.log(`Estimated transaction fee: ${fee} lamports`);

    // Remove the previous transfer instruction
    transaction.instructions.pop();

    // Add the instruction back with the correct amount of lamports minus fee
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
