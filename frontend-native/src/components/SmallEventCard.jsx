import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const placeholderImage = 'https://reactjs.org/logo-og.png'; // placeholder image

const SmallEventCard = ({ event, isBookmarked, onBookmarkPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onBookmarkPress(event.id)}
    >
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
      <TouchableOpacity 
        style={styles.bookmarkIcon} 
        onPress={() => onBookmarkPress(event.id)}
      >
        <Icon
          name={isBookmarked ? "bookmark" : "bookmark-o"}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    position: 'relative', // To position the bookmark icon
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
  bookmarkIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default SmallEventCard;
