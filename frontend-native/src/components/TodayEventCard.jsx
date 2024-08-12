import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const placeholderImage = 'https://reactjs.org/logo-og.png'; // placeholder image

const TodayEventCard = ({ event }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: placeholderImage }} style={styles.image} />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTime}>{event.time}</Text>
        <Text 
          style={styles.eventTitle}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {event.title}
        </Text>
        <Text style={styles.eventOrganizer}>{event.organizer}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 10,
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
