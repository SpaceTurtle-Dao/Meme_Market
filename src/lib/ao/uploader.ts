import Arweave from "arweave";
import mime from 'mime';
// @ts-ignore
export const upload = async (file) => {
  let mimeType = mime.getType(file.name);
  let ext = mime.getExtension(mimeType!);
  let data = await file.arrayBuffer()
  // #1 Get the data from the POST request; encoded as base64 string.
  //const b64string = req.body.b64string
  //const buf = Buffer.from(b64string, 'base64');

  // #2 Make a connection to Arweave server; following standard example.
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  // #4 Check out wallet balance. We should probably fail if too low?
  let address = await window.arweaveWallet.getActiveAddress();
  let pub = await window.arweaveWallet.getActivePublicKey();
  const arweaveWalletBallance = await arweave.wallets.getBalance(address);

  // #5 Core flow: create a transaction, upload and wait for the status!
  let transaction = await arweave.createTransaction({ data: data });
  // let video_transaction = await arweave.createTransaction({data: file});
  // video_transaction.addTag("Content-Type", "video/mp4");
  transaction.addTag('Content-Type', mimeType!);
  await arweave.transactions.sign(transaction);
  const response = await arweave.transactions.post(transaction);
  const status = await arweave.transactions.getStatus(transaction.id);
  let url = `https://www.arweave.net/${transaction.id}?ext=${ext}`;
  console.log(
    `Completed transaction ${transaction.id} with status code ${status}!`,
  );
  console.log(url);
  return {
    url:url,
    hash:transaction.id,
    ext: ext,
    mimeType: mimeType
  };
};