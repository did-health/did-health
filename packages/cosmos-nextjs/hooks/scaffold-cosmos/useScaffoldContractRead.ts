export const useScaffoldContractRead = async (params: {
  getCosmWasmClient: Function,
  contractAddr: string,
  queryMsg: object
}) => {
  const { getCosmWasmClient, contractAddr, queryMsg } = params;
  const client = await getCosmWasmClient();
  const result = await client.queryContractSmart(contractAddr, queryMsg);
  return result;
};
