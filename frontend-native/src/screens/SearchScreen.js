import { FlatList, View, StyleSheet } from 'react-native';
import EventCard from '../components/EventCard';
import Constants from 'expo-constants';
import Text from '../components/atomics/Text';
import Button from '../components/atomics/Button';
import { useEffect, useState } from 'react';
import DateFilterBtn from '../components/DateFilterBtn';
import SearchBar from '../components/SearchBar';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f5f7fa',
    // paddingBottom: 48
  },
  header: {
    // marginHorizontal: 16,
    // width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 16,
    gap: 16

  }
});

// mock event data
const date1 = new Date('2024-10-31T18:00:00');
const events = [
    {
        id: "e1",
        title: "Board Games Night",
        dateTime: date1,
        location: "Wilson Hall 2002",
        imageLink: 'tbd'
    },
    {
        id: "e2",
        title: "Board Games Night",
        dateTime: date1,
        location: "Wilson Hall 2002",
        imageLink: 'tbd'
    },
    {
        id: "e3",
        title: "Board Games Night",
        dateTime: date1,
        location: "Wilson Hall 2002",
        imageLink: 'tbd'
    },
    {
        id: "e4",
        title: "Board Games Night",
        dateTime: date1,
        location: "Wilson Hall 2002",
        imageLink: 'tbd'
    },
    {
        id: "e5",
        title: "Board Games Night",
        dateTime: date1,
        location: "Wilson Hall 2002",
        imageLink: 'tbd'
    },
    {
        id: "e6",
        title: "Board Games Night",
        dateTime: date1,
        location: "Wilson Hall 2002",
        imageLink: 'tbd'
    },
]

const EventItem = ({ item }) => <EventCard title={item.title} location={item.location} dateTime={item.dateTime} imageLink={item.imageLink} id={item.id} />;

const SearchScreen = ({ navigation }) => {
//   const { repositories } = useRepositories();
  // fetching is done in hooks
  // const [repositories, setRepositories] = useState();

  // const fetchRepositories = async () => {
  //   // Replace the IP address part with your own IP address!
  //   const response = await fetch('http://100.66.134.233:5000/api/repositories');
  //   const json = await response.json();
  
  //   console.log(json);
  
  //   setRepositories(json);
  // };

  // useEffect(() => {
  //   fetchRepositories();
  // }, []);

//   const repositoryNodes = repositories
//     ? repositories.edges.map(edge => edge.node)
//     : [];
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);


  return (
    <View style={styles.container}>
        {/* <Text fontSize="heading" fontWeight="bold">UofT Events</Text> */}
        <View style={styles.header}>
          <SearchBar clicked={searchClicked} setClicked={setSearchClicked} searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase}/>
        {!searchClicked && <DateFilterBtn />}
        </View>
        <FlatList
        data={events}
        // ItemSeparatorComponent={ItemSeparator}
        // other props
        // contentContainerStyle={{ flex: 1, alignSelf: "stretch" }}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", paddingHorizontal: 24, marginTop: 16 }}
        renderItem={EventItem}
        />
    </View>
  );
};

export default SearchScreen;