declare global {
  interface Window {
    ENV: {
      [key: string]: string
    }
  }
}

export type Nullable<T> = T | null;
