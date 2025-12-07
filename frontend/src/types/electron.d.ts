export {};

declare global {
  interface Window {
    electronAPI: {
      getUserData: () => Promise<any>;
      saveUserData: (data: any) => Promise<boolean>;
      deleteUserData: () => Promise<boolean>;
    };
  }
}
