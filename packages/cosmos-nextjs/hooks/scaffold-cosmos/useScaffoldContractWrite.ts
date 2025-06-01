import { notification } from "~~/utils/scaffold-eth";
import { SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";

export const useScaffoldContractWrite = async (params: {
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  address: string,
  contractAddr: string,
  executeMsg: object
}) => {
  const { getSigningCosmWasmClient, address, contractAddr, executeMsg } = params;
  const client = await getSigningCosmWasmClient();
  const result = await client.execute(
    address,
    contractAddr,
    executeMsg,
    'auto'
  ).catch((err: any) => {
    notification.error(err.message);
  });
  if (result) {
    notification.success(
      `Transaction success: ${process.env.EXPLORER_ADDRESS}${result.transactionHash}`
    );  
  }
  return result;
};