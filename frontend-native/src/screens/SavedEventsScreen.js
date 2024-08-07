import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import SmallEventCard from '../components/SmallEventCard';
import useGetSavedEvents from '../hooks/useGetSavedEvents';
import Text from '../components/atomics/Text';

const eventsData = [
  {
    date: 'Tuesday, July 9',
    events: [
      {
        id: 1,
        time: '8AM PT',
        title: 'US-POLAND SCIENCE AND TECHNOLOGY SYMPOSIUM 2024 blah',
        organizer: 'Bay Area Council Inc',
        image: 'path_to_image_1', // replace with actual path
      },
      {
        id: 11,
        time: '8AM PT',
        title: 'US-POLAND SCIENCE AND TECHNOLOGY SYMPOSIUM 2024 blah',
        organizer: 'Bay Area Council Inc',
        image: 'path_to_image_1', // replace with actual path
      },
    ],
  },
  {
    date: 'Thursday, July 11',
    events: [
      {
        id: 2,
        time: '8AM PT',
        title: 'AI Engineering Workshop SF - Build Your First AI App in a Day',
        organizer: 'Werqwise',
        image: 'path_to_image_2', // replace with actual path
      },
    ],
  },
  {
    date: 'Friday, July 12',
    events: [
      {
        id: 3,
        time: '5PM PT',
        title: '"Urban Tides" Art Exhibition Opening Reception',
        organizer: 'Ferry Building',
        image: 'path_to_image_3', // replace with actual path
      },
    ],
  },
];

const SavedEventsScreen = ({ navigation }) => {
  const { savedEvents, setSavedEvents, loading, refetch } = useGetSavedEvents();
  const memoizedSavedEvents = useMemo(() => savedEvents, [savedEvents]);

  const removeSavedEvent = (eventId) => {
    setSavedEvents((prev) =>
      prev
        .map(section => ({
          ...section,
          events: section.events.filter(event => event.id !== eventId)
        }))
        .filter(section => section.events.length > 0)
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text fontSize="subheading">Loading Saved Events...</Text>
      </View>
    )
  }

  if (memoizedSavedEvents && memoizedSavedEvents.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Saved Events</Text>
        <Text fontSize="subheading">Find your saved events here!</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Events</Text>
      <ScrollView>
        {!!memoizedSavedEvents && memoizedSavedEvents.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.date}>{section.date}</Text>
            {section.events.map((event) => (
              <SmallEventCard
                key={event.id}
                event={event}
                removeSavedEvent={removeSavedEvent}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    paddingTop: '20%',
  },
  header: {
    fontSize: 32,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  date: {
    fontSize: 15,
    color: '#000000',
    padding: 5,
    marginBottom: 10,
  },
});

export default SavedEventsScreen;
