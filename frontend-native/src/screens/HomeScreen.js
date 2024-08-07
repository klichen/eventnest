import React, { useState, useRef } from 'react';
import { FlatList, View, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native';
import EventCard from '../components/EventCard';
import Constants from 'expo-constants';
import Text from '../components/atomics/Text';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 5,
    backgroundColor: '#888',
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  eventItem: {
    width: width - 40,
    marginHorizontal: 20,
  },
  heading: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeading: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
    marginTop: 5,
  },
  keywordContainer: {
    width: '100%',
    height: 150,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
  },
  keywordBox: {
    width: 75,
    height: 75,
    marginHorizontal: 20,
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  keywordTextContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  keywordText: {
    textAlign: 'center',
  },
});

const date1 = new Date('2024-10-31T18:00:00');
const events = [
  {
    id: 'e1',
    title: 'Board Games Night',
    dateTime: date1,
    location: 'Wilson Hall 2002',
    imageLink: 'tbd',
  },
  {
    id: 'e2',
    title: 'Board Games Night',
    dateTime: date1,
    location: 'Wilson Hall 2002',
    imageLink: 'tbd',
  },
];

const keywords = [
  { label: 'Sports', icon: 'soccer-ball-o', library: 'FontAwesome', color: '#000077', backgroundColor: '#E0E0E0' },
  { label: 'Social & Party', icon: 'users', library: 'FontAwesome', color: '#000077', backgroundColor: '#E0E0FF' },
  { label: 'Food & Drink', icon: 'food', library: 'MaterialCommunityIcons', color: '#FF8C42', backgroundColor: '#FFF0E0' },
  { label: 'Games', icon: 'gamepad', library: 'FontAwesome', color: '#FF4242', backgroundColor: '#FFE0E0' },
  { label: 'Arts', icon: 'human-female-dance', library: 'MaterialCommunityIcons', color: 'blue', backgroundColor: '#E0E0FF' },
  { label: 'Health & Wellness', icon: 'heartbeat', library: 'FontAwesome', color: '#27ae60', backgroundColor: '#E0FFE0' },
  { label: 'Technology', icon: 'laptop', library: 'FontAwesome', color: '#34495e', backgroundColor: '#E0E0E0' },
];

const EventItem = ({ item }) => (
  <View style={styles.eventItem}>
    <EventCard
      title={item.title}
      location={item.location}
      dateTime={item.dateTime}
      imageLink={item.imageLink}
      id={item.id}
    />
  </View>
);

const KeywordItem = ({ item, navigation }) => {
  const IconComponent = item.library === 'FontAwesome' ? FontAwesomeIcon : MaterialCommunityIcons;
  return (
    <View>
      <TouchableOpacity
        style={[styles.keywordBox, { backgroundColor: item.backgroundColor }]}
        onPress={() => {
          console.log(`Navigating to Search with keyword: ${item.label}`);
          navigation.navigate('SearchStack', { screen: 'Search', params: { keyword: item.label } });
        }}
      >
        <IconComponent name={item.icon} size={30} color={item.color} />
      </TouchableOpacity>
      <View style={styles.keywordTextContainer}>
        <Text style={styles.keywordText}>{item.label}</Text>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore</Text>
      <Text style={styles.subHeading}>Find events around campus!</Text>
      <ScrollView>
        <View style={styles.keywordContainer}>
          <FlatList
            data={keywords}
            horizontal
            showsHorizontalScrollIndicator={true}
            renderItem={({ item }) => <KeywordItem item={item} navigation={navigation} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ alignItems: 'center' }}  // Center items vertically
          />
        </View>
        <Text style={styles.heading}>Recently Added</Text>
        <TouchableWithoutFeedback>
          <FlatList
            data={events}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <EventItem item={item} />}
            keyExtractor={(item) => item.id}
            onScroll={onScroll}
            ref={flatListRef}
            style={{ marginTop: 16 }}
          />
        </TouchableWithoutFeedback>
        <View style={styles.pagination}>
          {events.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <Text style={styles.heading}>What's Happening Today</Text>
        <Text style={styles.heading}>What's Happening Today</Text>
        <Text style={styles.heading}>What's Happening Today</Text>
        <Text style={styles.heading}>What's Happening Today</Text>
        <Text style={styles.heading}>What's Happening Today</Text>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
