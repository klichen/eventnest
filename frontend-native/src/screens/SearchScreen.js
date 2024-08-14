import { FlatList, View, StyleSheet, Keyboard } from 'react-native';
import EventCard from '../components/EventCard';
import Constants from 'expo-constants';
import Text from '../components/atomics/Text';
import { useEffect, useRef, useState, useCallback } from 'react';
import DateFilterBtn from '../components/DateFilterBtn';
import SearchBar from '../components/SearchBar';
import SearchEmptyState from '../components/SearchEmptyState';
import DateRangeDisplay from '../components/DateRangeDisplay';
import useGetUpcomingEvents from '../hooks/useGetUpcomingEvents';
import useSearchEvents from '../hooks/useSearchEvents';

const SearchScreen = ({ route, navigation }) => {
  const { keywords, searchLabel } = route.params || {};
  const { events, loading } = useGetUpcomingEvents();
  const { searchLoading, fetchSearchedEvents, fetchSearchedEventsByCategory } = useSearchEvents();

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [confirmedSearchPhrase, setConfirmedSearchPhrase] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const textInputRef = useRef(null);

  // date filter
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)

  // set initial events and check if coming from home screen category picker
  useEffect(() => {
    if (!!keywords && !!searchLabel) {
      const searchCategoryEvents = async () => {
        console.log(keywords);
        const searchedEvents = await fetchSearchedEventsByCategory({
          searchString: keywords
        });
        setFilteredEvents(searchedEvents);
      };
      setSearchPhrase(searchLabel);
      searchCategoryEvents();
    }
    else {
      setFilteredEvents(events);
    }
  }, [events, route])

  const handleClearSearch = useCallback(() => {
    setSearchPhrase("")
    if (confirmedSearchPhrase === "") {
      setFilteredEvents(events);
    };
    setConfirmedSearchPhrase("")
    textInputRef.current.focus()
  }, [])

  const handleSubmitSearch = useCallback(() => {
    setConfirmedSearchPhrase(searchPhrase)
    setSearchClicked(false);
  }, [searchPhrase, filteredEvents]);

  const handleCancelSearch = useCallback(() => {
    Keyboard.dismiss();
    if (confirmedSearchPhrase === "") {
      setFilteredEvents(events);
    };
    setSearchPhrase("");
    setConfirmedSearchPhrase("");
    setSearchClicked(false);
  }, [events]);

  const handleClearDates = useCallback(() => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  }, [events]);

  useEffect(() => {
    const searchAndSetEvents = async () => {
      const searchedEvents = await fetchSearchedEvents({
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        searchString: confirmedSearchPhrase
      });
      setFilteredEvents(searchedEvents);
    };
    if (!confirmedSearchPhrase && !selectedStartDate && !selectedEndDate) {
      setFilteredEvents(events);
    }
    else {
      searchAndSetEvents();
    }
  }, [selectedStartDate, selectedEndDate, confirmedSearchPhrase]);

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
  if (searchLoading) {
    return (
      <View style={styles.container}>
        <Text fontSize="subheading">Searching Events...</Text>
      </View>
    )
  }
  else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchRow}>
            <SearchBar clicked={searchClicked} setClicked={setSearchClicked} searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} handleSubmitSearch={handleSubmitSearch} handleCancelSearch={handleCancelSearch} ref={textInputRef} />
            {!searchClicked && <DateFilterBtn setSelectedStartDate={setSelectedStartDate} setSelectedEndDate={setSelectedEndDate} />}
          </View>
          {selectedStartDate && selectedEndDate && <DateRangeDisplay selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} handleClearDates={handleClearDates} />}
        </View>
        <FlatList
          data={filteredEvents}
          // other props
          showsVerticalScrollIndicator={true}
          style={{ width: "100%", paddingHorizontal: 24, marginTop: 16, marginBottom: 16 }}
          renderItem={EventItem}
          ListEmptyComponent={<SearchEmptyState searchPhrase={searchPhrase} handleClearSearch={handleClearSearch} hasDateRange={!!selectedStartDate} />}
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
    paddingBottom: 0
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'column',
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16
  }
});

export default SearchScreen;

// below is the filtering implementation in the frontend

// const [confirmedSelectedStartDate, setConfirmedSelectedStartDate] = useState(null)
// const [confirmedSelectedEndDate, setConfirmedSelectedEndDate] = useState(null)

// const getCompareDate = (date) => {
//   const eventDate = new Date(date);
//   console.log(eventDate);
//   return eventDate.setHours(0, 0, 0, 0);
// }

// const filterEvents = useCallback(() => {
//   let filtered = events;

//   if (selectedStartDate && selectedEndDate) {
//     filtered = filtered.filter(e => getCompareDate(e.start_datetime) >= selectedStartDate && getCompareDate(e.start_datetime) <= selectedEndDate)
//   }

//   if (confirmedSearchPhrase) {
//     filtered = filtered.filter(e => e.title.toLowerCase().includes(confirmedSearchPhrase.toLowerCase()))
//   }

//   return filtered;
// }, [confirmedSearchPhrase, selectedStartDate, selectedEndDate])

// useEffect(() => {
//   setFilteredEvents(filterEvents());
// }, [confirmedSearchPhrase, selectedStartDate, selectedEndDate, filterEvents])