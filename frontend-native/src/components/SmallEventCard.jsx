import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { parseISOString } from '../utils/helperFunctions';
import useGetClubInformation from '../hooks/useGetClubInformation';
import LoadSkeleton from './LoadSkeleton';
import { useNavigation } from '@react-navigation/native';
import useEventSavedStatus from '../hooks/useEventSavedStatus';
import { removeEventId, setEventId } from '../utils/AsyncStorage';

const placeholderImage = 'https://reactjs.org/logo-og.png'; // placeholder image

const SmallEventCard = ({ event }) => {
  const { id, eventTitle, startDatetime, endDatetime, clubId, imageLink, eventLink, location, eventDescription } = event;
  const eventId = 'event' + id;
  const startTime = startDatetime ? parseISOString(startDatetime) : null;
  const { clubInfo = {}, loading } = useGetClubInformation(clubId);
  const { name: clubName } = clubInfo;
  const navigation = useNavigation();
  const [saved, setSaved] = useEventSavedStatus(eventId);

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

  const handleOnPressSave = () => {
    if (saved) {
        removeEventId(eventId);
    }
    else {
        setEventId(eventId);
    }
    setSaved(!saved);
}

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
      <View style={styles.saveIcon}>
        <Pressable onPress={handleOnPressSave} hitSlop={{ top: 25, bottom: 15, left: 25, right: 15 }}>
          <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={24} color="#007FA3" />
        </Pressable>
      </View>
      {/* <TouchableOpacity
        style={styles.bookmarkIcon}
        onPress={() => onBookmarkPress(event.id)}
      >
        <Icon
          name={isBookmarked ? "bookmark" : "bookmark-o"}
          size={20}
          color="#000"
        />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    // position: 'relative', // To position the bookmark icon
    backgroundColor: '#fff', // White background for the card
    borderRadius: 10, // Rounded corners
    borderWidth: 1, // Border width
    borderColor: '#ddd', // Border color
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5, // Elevation for Android shadow
    padding: 10, // Padding inside the card
    width: '100%', // Ensuring the card takes full width in both web and mobile
    // alignItems: 'flex-end'
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
  saveIcon: {
    alignSelf: 'flex-end',
    // padding: 8
},
});

export default SmallEventCard;
