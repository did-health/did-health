import React from 'react';
import { ConnectWallet } from '../eth/WalletConnectETH';
import { SetupStorage } from '../SetupStorage';
import { ConnectLit } from '../lit/ConnectLit';

export function SettingsPanel({ onStorageReady }: { onStorageReady?: (client: any) => void }) {
  const onReady = onStorageReady || ((client: any) => {});
  return (
    <>
      <ConnectWallet />
      <SetupStorage onReady={onReady} />
      <ConnectLit />
    </>
  );
}
