import { useState, useEffect, useCallback } from 'react';
import { checkEventIsSaved } from '../utils/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';

const useEventSavedStatus = (eventId) => {
  const [saved, setSaved] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkSavedStatus = async () => {
        const isSaved = await checkEventIsSaved(eventId);
        setSaved(isSaved);
      };

      checkSavedStatus();
    }, [eventId])
  );

  return [saved, setSaved];
};

export default useEventSavedStatus;
