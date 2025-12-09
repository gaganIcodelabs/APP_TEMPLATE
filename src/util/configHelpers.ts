// Basic config helpers
// Simplified version for React Native

export const mergeConfig = (hostedConfig: any = {}, defaultConfig: any) => {
  // Simple merge for now - can be expanded with deep merge logic later
  return {
    ...defaultConfig,
    ...hostedConfig,
  };
};
