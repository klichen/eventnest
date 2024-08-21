import { FlatList, View, StyleSheet, Keyboard } from 'react-native';
import EventCard from '../components/EventCard';
import Constants from 'expo-constants';
import Text from '../components/atomics/Text';
import { useEffect, useRef, useState, useCallback } from 'react';
import DateFilterBtn from '../components/DateFilterBtn';
import SearchBar from '../components/SearchBar';
import SearchEmptyState from '../components/SearchEmptyState';
import SearchDateRangeRemovers from '../components/SearchDateRangeRemovers';
import useGetUpcomingEvents from '../hooks/useGetUpcomingEvents';
import useSearchEvents from '../hooks/useSearchEvents';

const SearchScreen = ({ route, navigation }) => {
  const { keywords, searchLabel } = route.params || {};
  const { events, loading, refetch } = useGetUpcomingEvents();
  const { searchLoading, fetchSearchedEvents, fetchSearchedEventsByCategory } = useSearchEvents();

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [categoryEvents, setCategoryEvents] = useState(null);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [confirmedSearchPhrase, setConfirmedSearchPhrase] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const textInputRef = useRef(null);

  // date filter
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)

  // distinguish whether searching category or using searchbar
  const [isSearchingCategory, setIsSearchingCategory] = useState(false)

  // set initial events and check if coming from home screen category picker
  useEffect(() => {
    if (!!keywords && !!searchLabel) {
      setIsSearchingCategory(true);
      const searchCategoryEvents = async () => {
        const searchedEvents = await fetchSearchedEventsByCategory({
          searchString: keywords
        });
        setCategoryEvents(searchedEvents);
        setFilteredEvents(searchedEvents);
      };
      setSearchPhrase(searchLabel);
      searchCategoryEvents();
    }
    else {
      setFilteredEvents(events);
      setIsSearchingCategory(false);
    }
  }, [events, route])

  const handleClearSearch = useCallback(() => {
    setSearchPhrase("");
    setConfirmedSearchPhrase("");
    setFilteredEvents(events);
  }, []);

  const handleClearCategorySearch = useCallback(() => {
    setSearchPhrase("");
    setIsSearchingCategory(false);
    setFilteredEvents(events);
  }, []);

  const handleSubmitSearch = useCallback(() => {
    setIsSearchingCategory(false);
    setConfirmedSearchPhrase(searchPhrase)
    setSearchClicked(false);
  }, [searchPhrase, filteredEvents]);

  const handleCancelSearch = useCallback(() => {
    Keyboard.dismiss();
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
    const searchAndSetCategoryEvents = async () => {
      const searchedEvents = await fetchSearchedEventsByCategory({
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        searchString: keywords
      });
      setFilteredEvents(searchedEvents);
    };

    if (!confirmedSearchPhrase && !selectedStartDate && !selectedEndDate) {
      if (isSearchingCategory) {
        setFilteredEvents(categoryEvents);
      }
      else {
        setFilteredEvents(events);
      }
    }
    else if (isSearchingCategory) {
      searchAndSetCategoryEvents();
    }
    else {
      searchAndSetEvents();
    }
  }, [selectedStartDate, selectedEndDate, confirmedSearchPhrase, isSearchingCategory]);

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
          {(confirmedSearchPhrase || (selectedStartDate && selectedEndDate) && !isSearchingCategory) ? <SearchDateRangeRemovers selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} handleClearDates={handleClearDates} confirmedSearchPhrase={confirmedSearchPhrase} handleClearSearch={handleClearSearch} /> : null}
          {isSearchingCategory ? <SearchDateRangeRemovers selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} handleClearDates={handleClearDates} confirmedSearchPhrase={confirmedSearchPhrase} handleClearSearch={handleClearCategorySearch} searchingCategory={isSearchingCategory} /> : null}
        </View>
        <FlatList
          data={filteredEvents}
          // other props
          showsVerticalScrollIndicator={true}
          style={{ width: "100%", paddingHorizontal: 24, marginTop: 16, marginBottom: 16 }}
          renderItem={EventItem}
          ListEmptyComponent={<SearchEmptyState searchPhrase={searchPhrase} hasDateRange={!!selectedStartDate} refetch={refetch} />}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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