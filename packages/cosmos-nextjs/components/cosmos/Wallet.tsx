import { useEffect } from "react";
import {
  Box,
  ClipboardCopyText,
  TextField,
  Stack,
  useColorModeValue,
} from "@interchain-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { chains } from "chain-registry";
import {
  Button,
  ButtonConnect,
  ButtonConnected,
  ButtonConnecting,
  ButtonDisconnected,
  ButtonError,
  ButtonNotExist,
  ButtonRejected,
} from "./Connect";
import React from "react";
import { verifyADR36Amino } from "@keplr-wallet/cosmos";

export type WalletProps = {
  chainName?: string;
  onChainChange?: (chainName?: string) => void;
};

export function Wallet({
    chainName,
    onChainChange = () => {},
  }: WalletProps) {
  const usedChain = useChain(process.env.CHAIN ?? "dhealth");
  const {
    chain,
    status,
    wallet,
    username,
    address,
    message,
    connect,
    openView,
  } = usedChain;

  const ConnectButton = {
    [WalletStatus.Connected]: <ButtonConnected onClick={openView} />,
    [WalletStatus.Connecting]: <ButtonConnecting />,
    [WalletStatus.Disconnected]: <ButtonDisconnected onClick={connect} />,
    [WalletStatus.Error]: <ButtonError onClick={openView} />,
    [WalletStatus.Rejected]: <ButtonRejected onClick={connect} />,
    [WalletStatus.NotExist]: <ButtonNotExist onClick={openView} />,
  }[status] || <ButtonConnect onClick={connect} />;

  function handleChainChange(chainName?: string) {
    if (chainName) {
      onChainChange(chainName);
      localStorage.setItem("selected-chain", chainName!);
    }
  }

  useEffect(() => {
    const selected = localStorage.getItem("selected-chain");
    if (selected && selected !== chainName) {
      onChainChange(selected);
    }
  }, []);

  return (
    <Box py="$10" width="15rem">
      <Box
        my="$8"
        flex="1"
        width="full"
        display="flex"
        height="$16"
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        px={{ mobile: "$8", tablet: "$10" }}
      >
        {ConnectButton}
      </Box>
    </Box>
  );
}