// Global type declarations for UniSat wallet
interface UniSatWallet {
  requestAccounts: () => Promise<string[]>
  sendBitcoin: (address: string, amount: number, unit: 'sat' | 'btc') => Promise<{
    txid: string
  }>
}

declare global {
  interface Window {
    unisat?: UniSatWallet
  }
}
