import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkEventIsSaved = async (id) => {
    try {
      const saved = await AsyncStorage.getItem(id);
      return !!saved
    }
    catch(e) {
        console.error('Error checking event id: ', e);
    }
  }

export const setEventId = async (id) => {
    try {
        await AsyncStorage.setItem(id, 'v');
    }
    catch (e) {
        console.error('Error setting event id: ', e);
    }
}

export const removeEventId = async (id) => {
    try {
        await AsyncStorage.removeItem(id);
    }
    catch (e) {
        console.error('Error removing event id: ', e);
    }
}

export const getAllEventIds = async () => {
    let ids = []
    try {
        ids = await AsyncStorage.getAllKeys()
        // console.log(ids)
        return ids.map((id) => id.replace('event', ''));
    }
    catch (e) {
        console.error('Error getting all event ids: ', e);
    }
    return ids
}