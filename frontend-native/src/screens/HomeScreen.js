import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native';
import EventCard from '../components/EventCard';
import Constants from 'expo-constants';
import Text from '../components/atomics/Text';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TodayEventCard from '../components/TodayEventCard';
import useGetRecentlyAddedEvents from '../hooks/useGetRecentlyAddedEvents';
import LoadSkeleton from '../components/LoadSkeleton';
import useSearchEvents from '../hooks/useSearchEvents';

const { width } = Dimensions.get('window');

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

const todayEvents2 = [
  {
    id: 't1',
    title: 'Yoga Class',
    time: '10:00 AM',
    organizer: 'Health Club',
    isBookmarked: false,
  },
  {
    id: 't2',
    title: 'Guest Lecture',
    time: '2:00 PM',
    organizer: 'Science Department',
    //isBookmarked: true,
  },
];

const keywords = [
  { label: 'Sports', icon: 'soccer-ball-o', library: 'FontAwesome', color: '#000077', backgroundColor: '#E0E0E0', searchString: 'sport tournament match race cheer sports' },
  { label: 'Social & Party', icon: 'users', library: 'FontAwesome', color: '#000077', backgroundColor: '#E0E0FF', searchString: 'party socialnparties nightlife community networking' },
  { label: 'Food & Drink', icon: 'food', library: 'MaterialCommunityIcons', color: '#FF8C42', backgroundColor: '#FFF0E0', searchString: 'food drink icecream cooking baking' },
  { label: 'Games', icon: 'gamepad', library: 'FontAwesome', color: '#FF4242', backgroundColor: '#FFE0E0', searchString: 'videogame boardgame esport cardgame trivia poker' },
  { label: 'Arts', icon: 'human-female-dance', library: 'MaterialCommunityIcons', color: 'blue', backgroundColor: '#E0E0FF', searchString: 'art crafts festival performance photography media' },
  { label: 'Health & Wellness', icon: 'heartbeat', library: 'FontAwesome', color: '#27ae60', backgroundColor: '#E0FFE0', searchString: 'mental health fitness meditation nutrition stress' },
  { label: 'Technology', icon: 'laptop', library: 'FontAwesome', color: '#34495e', backgroundColor: '#E0E0E0', searchString: 'tech computer hackathon code machine' },
];

const KeywordItem = ({ item, navigation }) => {
  const IconComponent = item.library === 'FontAwesome' ? FontAwesomeIcon : MaterialCommunityIcons;
  return (
    <View>
      <TouchableOpacity
        style={[styles.keywordBox, { backgroundColor: item.backgroundColor }]}
        onPress={() => {
          navigation.navigate('SearchStack', { screen: 'Search', params: { keywords: item.searchString, searchLabel: item.label } });
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

const EventItem = ({ item }) => (
  <View style={styles.eventItem}>
    <EventCard
      title={item.title}
      description={item.description}
      location={item.location}
      startDatetime={item.start_datetime}
      endDatetime={item.end_datetime}
      imageLink={item.image_link}
      id={item.id}
      clubId={item.club_id}
      eventLink={item.event_link}
    />
  </View>
);

const HomeScreen = ({ navigation }) => {
  const { recentlyAddedEvents, loading: recentlyAddedPostsLoading } = useGetRecentlyAddedEvents();
  const { searchLoading: eventsTodayLoading, fetchSearchedEvents: getEventsToday } = useSearchEvents();
  const [todayEvents, setTodayEvents] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const getAndSetEventsHappeningToday = async () => {
      const today = new Date().toISOString();
      const eventsToday = await getEventsToday({
        startDate: today,
        endDate: today,
      });
      setTodayEvents(eventsToday);
    };
    getAndSetEventsHappeningToday();
  }, []);

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
        {recentlyAddedPostsLoading ?
          <View style={styles.skeletons}>
            <LoadSkeleton width={'90%'} height={300} />
            {/* <LoadSkeleton width={'80%'} /> */}
            <LoadSkeleton width={'30%'} />
          </View>
          :
          <View>
            <TouchableWithoutFeedback>
              <FlatList
                data={recentlyAddedEvents}
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
              {!!recentlyAddedEvents && recentlyAddedEvents.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>}
        <Text style={styles.heading}>What's Happening Today</Text>
        {eventsTodayLoading ?
          <View style={styles.skeletons}>
            <LoadSkeleton height={85} width='90%' />
            <LoadSkeleton height={85} width='90%' />
          </View>
          :
          <ScrollView>
            {!!todayEvents && todayEvents.map((item, index) => (
              <View key={index}>
                <TodayEventCard
                  eventTitle={item.title}
                  eventDescription={item.description}
                  location={item.location}
                  startDatetime={item.start_datetime}
                  endDatetime={item.end_datetime}
                  imageLink={item.image_link}
                  id={item.id}
                  clubId={item.club_id}
                  eventLink={item.event_link}
                />
              </View>
            ))}
          </ScrollView>
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 20,
    backgroundColor: '#f5f7fa',
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
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
  skeletons: {
    marginTop: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8
  }
});

export default HomeScreen;
