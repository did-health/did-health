// DAOContract.ts - Application logic to interact with DAO contract
import { ethers, formatEther } from 'ethers';

export async function applyToDAO(
  daoContract: ethers.Contract,
  wallet: string,
  did: string,
  role: string,
  orgName: string,
  ipfsUri: string
) {
  const fee = await daoContract.registrationFee();
  console.log('Registration fee:', formatEther(fee), 'ETH');

  console.log('Applying to DAO with:', {
    wallet,
    did,
    role,
    orgName,
    ipfsUri
  });
const tx = await daoContract.applyForMembership(did, role, orgName, ipfsUri, {
    value: fee,
  });
  await tx.wait();
}

// ResolveDAOProfile.ts - Get profile for a wallet address
export async function resolveDAOProfile(contract: ethers.Contract, address: string) {
  const [did, role, orgName] = await contract.getProfile(address);
  console.log('Resolved profile:', { did, role, orgName });
  return { did, role, orgName };
}
