import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { parseISOString } from '../utils/helperFunctions';
import useGetClubInformation from '../hooks/useGetClubInformation';
import LoadSkeleton from './LoadSkeleton';
import { useNavigation } from '@react-navigation/native';
import { removeEventId } from '../utils/AsyncStorage';

const placeholderImage = 'https://reactjs.org/logo-og.png'; // placeholder image

const SmallEventCard = ({ event, removeSavedEvent }) => {
  const { id, eventTitle, startDatetime, endDatetime, clubId, imageLink, eventLink, location, eventDescription } = event;
  const eventId = 'event' + id;
  const startTime = startDatetime ? parseISOString(startDatetime) : null;
  const { clubInfo = {}, loading } = useGetClubInformation(clubId);
  const { name: clubName } = clubInfo;
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate('Event', {
      eventId,
      clubId,
      eventTitle,
      eventDescription,
      startDatetime,
      endDatetime,
      location,
      imageLink,
      eventLink,
    });
  }

  const handleUnsaveEvent = () => {
    removeEventId(eventId);
    removeSavedEvent(id)
  }

  const handleOnPressRemoveIcon = () =>
    Alert.alert('Remove saved event?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: handleUnsaveEvent },
    ]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleNavigate}
    >
      <Image source={{ uri: imageLink }} style={styles.image} />
      <View style={styles.eventDetails}>
        {startTime && <Text style={styles.eventTime}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
        <Text
          style={styles.eventTitle}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {eventTitle}
        </Text>
        {!loading ?
          <Text style={styles.eventOrganizer}>{clubName}</Text>
          :
          <View style={styles.skeletons}>
            <LoadSkeleton width={'40%'} height={12} />
          </View>}

      </View>
      <View style={styles.removeIcon}>
        <TouchableOpacity onPress={handleOnPressRemoveIcon} hitSlop={{ top: 25, bottom: 15, left: 25, right: 15 }}>
          <MaterialCommunityIcons name={"bookmark-remove"} size={28} color="#007FA3" />
          {/* <Ionicons name={"bookmark"} size={24} color="#007FA3" /> */}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    padding: 10,
    width: '100%',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  eventDetails: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginRight: 20,
  },
  eventTime: {
    fontSize: 12,
    color: '#007FA3',
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventOrganizer: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 0,
  },
  bookmarkIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  removeIcon: {
    alignSelf: 'flex-end',
    // padding: 8
  },
});

export default SmallEventCard;
