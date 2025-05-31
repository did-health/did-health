const { Wallet } = require("ethers");
require("dotenv").config();

const key = process.env.DEPLOYER_PRIVATE_KEY;
if (!key) throw new Error("Missing DEPLOYER_PRIVATE_KEY");

const wallet = new Wallet(key);
console.log("Your deployer address is:", wallet.address);
