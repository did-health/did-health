declare global {
  interface Window {
    xverse?: {
      connect: () => Promise<{ addresses: { bitcoin: string } }>
      request: (method: string, args: { payload: string }) => Promise<{ signature: string }>
    }
  }
}

export {}
