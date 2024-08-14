import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import SmallEventCard from '../components/SmallEventCard';
import useGetSavedEvents from '../hooks/useGetSavedEvents';
import Text from '../components/atomics/Text';

const SavedEventsScreen = ({ navigation }) => {
  const { savedEvents, setSavedEvents, loading, refetch } = useGetSavedEvents();

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

  if ((savedEvents && savedEvents.length === 0) || !savedEvents) {
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
        {!!savedEvents && savedEvents.map((section, index) => (
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
