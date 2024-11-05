/// <reference types="vite/client" />

export {}; // Ensure the file is treated as a module

declare global {
  interface Window {
    google: any;
  }
}
