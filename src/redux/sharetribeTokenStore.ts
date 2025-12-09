import AsyncStorage from '@react-native-async-storage/async-storage';

const sharetribeTokenStore = ({ clientId }: { clientId: string }) => {
  const storageKey = `st-${clientId}-token`;

  return {
    setToken: async (token: any) => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(token));
      } catch (error) {
        console.error('Error saving token:', error);
      }
    },
    getToken: async () => {
      try {
        const token = await AsyncStorage.getItem(storageKey);
        return token ? JSON.parse(token) : null;
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    },
    removeToken: async () => {
      try {
        await AsyncStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Error removing token:', error);
      }
    },
  };
};

export default sharetribeTokenStore;
