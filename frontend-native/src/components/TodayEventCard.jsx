import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { parseISOString } from '../utils/helperFunctions';
import useGetClubInformation from '../hooks/useGetClubInformation';
import LoadSkeleton from './LoadSkeleton';
import { useNavigation } from '@react-navigation/native';

const placeholderImage = 'https://reactjs.org/logo-og.png';

const TodayEventCard = ({ id, eventTitle, startDatetime, endDatetime, clubId, imageLink, eventLink, location, eventDescription }) => {
  const imageUri = !!imageLink ? imageLink : placeholderImage;
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

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigate}>
      <Image source={{ uri: imageUri }} style={styles.image} />
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
          <View>
            <LoadSkeleton width={'40%'} height={12} />
          </View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
    position: 'relative',
    borderWidth: 0,
    backgroundColor: 'white',
    borderColor: '#ddd',
    elevation: 5,
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
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 20,
  },
  eventTime: {
    fontSize: 12,
    color: '#ff7f50',
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
});

export default TodayEventCard;
