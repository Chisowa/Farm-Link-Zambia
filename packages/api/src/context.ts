/**
 * This file contains the context type for tRPC.
 * Replace with your actual context implementation.
 */

export type Context = {
  userId?: string;
  isAuthenticated: boolean;
};

export const createContext = (): Context => {
  return {
    isAuthenticated: false,
  };
};
