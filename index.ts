import bs58 from 'bs58';
import { VersionedTransaction } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';


const INPUT_MINT = "So11111111111111111111111111111111111111112"
const TRUMP_TOKEN_MINT = '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN'
const qty = 100000000;
const privateKey = ""

const wallet = Keypair.fromSecretKey(bs58.decode(privateKey))

async function swap() {
    const quoteResponse = await (
    await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${INPUT_MINT}&outputMint=${TRUMP_TOKEN_MINT}&amount=${qty}`
    )
  ).json();
  
// console.log("QuoteResponse",JSON.stringify(quoteResponse, null, 2));
  
const swapResponse: any  = await (
    await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey,

        })
    })
).json()

// console.log("swap response",swapResponse)

const transactionBase64 = swapResponse.swapTransaction
const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));
console.log(transaction);

transaction.sign([wallet]);

const transactionBinary = transaction.serialize();
console.log(transactionBinary);


};

swap()