import { FlatList, View, StyleSheet, Keyboard } from 'react-native';
import EventCard from '../components/EventCard';
import Constants from 'expo-constants';
import Text from '../components/atomics/Text';
import Button from '../components/atomics/Button';
import { useEffect, useRef, useState, useCallback } from 'react';
import DateFilterBtn from '../components/DateFilterBtn';
import SearchBar from '../components/SearchBar';
import SearchEmptyState from '../components/SearchEmptyState';
import DateRangeDisplay from '../components/DateRangeDisplay';
import useGetUpcomingEvents from '../hooks/useGetUpcomingEvents';

// mock event data
const date1 = new Date('2024-07-31T18:00:00');
const date2 = new Date('2024-08-14T18:00:00');
const date3 = new Date('2024-10-31T18:00:00');
// const events = [
//   {
//       id: "e1",
//       title: "Board Games Night",
//       dateTime: date1,
//       location: "Wilson Hall 2002",
//       imageLink: 'https://www.instagram.com/p/C2GJxNiRAc8/media'
//   },
//   {
//       id: "e2",
//       title: "Tech Talk: Future of AI",
//       dateTime: date1,
//       location: "Engineering Building 101",
//       imageLink: 'https://www.instagram.com/p/C8hV50jAy90/media'
//   },
//   {
//       id: "e3",
//       title: "Cooking Workshop: Italian Cuisine",
//       dateTime: date2,
//       location: "Community Center Kitchen",
//       imageLink: 'https://www.instagram.com/p/C8hV50jAy90/media'
//   },
//   {
//       id: "e4",
//       title: "Yoga and Wellness Session",
//       dateTime: date2,
//       location: "Main Gym",
//       imageLink: 'https://www.instagram.com/p/C8hV50jAy90/media'
//   },
//   {
//       id: "e5",
//       title: "Art Exhibition: Modern Art",
//       dateTime: date3,
//       location: "Art Gallery",
//       imageLink: 'https://www.instagram.com/p/C8hV50jAy90/media'
//   },
//   {
//       id: "e6",
//       title: "Live Music Night",
//       dateTime: date3,
//       location: "Campus Cafe",
//       imageLink: 'https://www.instagram.com/p/C8hV50jAy90/media'
//   },
// ];


const SearchScreen = ({ navigation }) => {
  const { events, loading } = useGetUpcomingEvents()
  // console.log(events)


  const [filteredEvents, setFilteredEvents] = useState(events)
  const [searchPhrase, setSearchPhrase] = useState("")
  const [confirmedSearchPhrase, setConfirmedSearchPhrase] = useState("")
  const [searchClicked, setSearchClicked] = useState(false);
  const textInputRef = useRef(null)

  // date filter
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)

  const getCompareDate = (date) => {
    const eventDate = new Date(date.getTime())
    return eventDate.setHours(0, 0, 0, 0)
  }

  const filterEvents = useCallback(() => {
    let filtered = events;

    if (selectedStartDate && selectedEndDate) {
      filtered = filtered.filter(e => getCompareDate(e.dateTime) >= selectedStartDate && getCompareDate(e.dateTime) <= selectedEndDate)
    }

    if (confirmedSearchPhrase) {
      filtered = filtered.filter(e => e.title.toLowerCase().includes(confirmedSearchPhrase.toLowerCase()))
    }

    return filtered;
  }, [confirmedSearchPhrase, selectedStartDate, selectedEndDate])

  useEffect(() => {
    setFilteredEvents(filterEvents());
  }, [confirmedSearchPhrase, selectedStartDate, selectedEndDate, filterEvents])

  useEffect(() => {
    setFilteredEvents(events);
  }, [events, loading])

  const handleClearSearch = useCallback(() => {
    setSearchPhrase("")
    setConfirmedSearchPhrase("")
    textInputRef.current.focus()
  }, [])

  const handleSubmitSearch = useCallback(() => {
    // const newEvents = searchPhrase ? events.filter(e => e.title.toLowerCase().includes(searchPhrase.toLowerCase())) : events;
    // const filteredEventList = filterEvents()
    setConfirmedSearchPhrase(searchPhrase)
    // setFilteredEvents(filterEvents());
    setSearchClicked(false);
  }, [searchPhrase, filteredEvents]);

  const handleCancelSearch = useCallback(() => {
    Keyboard.dismiss()
    setSearchPhrase("")
    setSearchClicked(false)
    setFilteredEvents(events)
  }, []);

  const handleClearDates = useCallback(() => {
    setSelectedStartDate(null)
    setSelectedEndDate(null)
  }, []);

  const handleSubmitDateRange = useCallback(() => {
    setFilteredEvents(filterEvents())
  }, [filteredEvents])

  const EventItem = ({ item }) => <EventCard 
    title={item.title} 
    description={item.description}
    location={item.location} 
    startDatetime={item.start_datetime} 
    endDatetime={item.end_datetime} 
    imageLink={item.image_link} 
    id={item.id} 
    clubId={item.club_id}
    eventLink={item.event_link}
  />;

  if (loading) {
    return (
    <View style={styles.container}>
      <Text fontSize="subheading">Loading Events...</Text>
    </View>
  )
  }
  else {
    return (
      <View style={styles.container}>
        {/* <Text fontSize="heading" fontWeight="bold">UofT Events</Text> */}
        <View style={styles.header}>
          <View style={styles.searchRow}>
            <SearchBar clicked={searchClicked} setClicked={setSearchClicked} searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} handleSubmitSearch={handleSubmitSearch} handleCancelSearch={handleCancelSearch} ref={textInputRef} />
            {!searchClicked && <DateFilterBtn setSelectedStartDate={setSelectedStartDate} setSelectedEndDate={setSelectedEndDate} handleSubmitDateRange={handleSubmitDateRange} />}
          </View>
          {selectedStartDate && selectedEndDate && <DateRangeDisplay selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} handleClearDates={handleClearDates} />}
        </View>
        <FlatList
          data={filteredEvents}
          // other props
          contentContainerStyle={{ paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", paddingHorizontal: 24, marginTop: 16, marginBottom: 32 }}
          renderItem={EventItem}
          ListEmptyComponent={<SearchEmptyState setSearchPhrase={setSearchPhrase} handleClearSearch={handleClearSearch} />}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // gap: 16
  },
  searchRow: {
    // paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16
  }
});

export default SearchScreen;