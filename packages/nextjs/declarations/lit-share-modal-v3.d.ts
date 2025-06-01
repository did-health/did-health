// in a file like types/lit-share-modal-v3.d.ts
declare module 'lit-share-modal-v3' {
    var ShareModal: React.ComponentType<{
      onClose: () => void;
      onUnifiedAccessControlConditionsSelected: (shareModalOutput: any) => void;
    }>;
    export = ShareModal;
  }