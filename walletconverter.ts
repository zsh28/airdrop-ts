import bs58 from 'bs58';
import promptSync from 'prompt-sync';

// Initialize prompt-sync
const prompt = promptSync();

// Function to convert Base58 string to a wallet format (byte array)
function base58ToWallet() {
  const input = prompt('Enter your Base58 string: ');
  try {
    const wallet = bs58.decode(input);
    console.log('Wallet:', wallet);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Invalid Base58 string:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  }
}

// Function to convert a wallet format (byte array) to a Base58 string
function walletToBase58() {
  const wallet = new Uint8Array([34, 46, 55, 124, 141, 190, 24, 204, 134, 91, 70, 184, 161, 181, 44, 122, 15, 172, 63, 62, 153, 150, 99, 255, 202, 89, 105, 77, 41, 89, 253, 130, 27, 195, 134, 14, 66, 75, 182, 7, 132, 234, 160, 203, 109, 195, 116, 251, 144, 44, 28, 56, 231, 114, 50, 131, 185, 168, 138, 61, 35, 98, 78, 53]);
  const base58 = bs58.encode(wallet);
  console.log('Base58:', base58);
}

// Example usage
base58ToWallet();
walletToBase58();
