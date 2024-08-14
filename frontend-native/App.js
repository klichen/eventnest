import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SavedEventsScreen from './src/screens/SavedEventsScreen';
import EventScreen from './src/screens/EventScreen';

// screen route names
const homeRoute = 'Home';
const homeStack = 'HomeStack';
const eventRoute = 'Event';
const searchStack = 'SearchStack';
const searchRoute = 'Search';
const savedEventsRoute = 'Saved';
const savedEventsStack = 'SavedStack';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const SavedEventsStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={homeRoute} component={HomeScreen} />
      <HomeStack.Screen name={eventRoute} component={EventScreen} />
    </HomeStack.Navigator>
  )
};

function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name={searchRoute} component={SearchScreen} />
      <SearchStack.Screen name={eventRoute} component={EventScreen} />
    </SearchStack.Navigator>
  )
};

function SavedEventsStackScreen() {
  return (
    <SavedEventsStack.Navigator screenOptions={{ headerShown: false }}>
      <SavedEventsStack.Screen name={savedEventsRoute} component={SavedEventsScreen} />
      <SavedEventsStack.Screen name={eventRoute} component={EventScreen} />
    </SavedEventsStack.Navigator>
  )
};

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={homeStack}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size}) => {
              let iconName;
              let rn = route.name;

              if (rn === homeStack) {
                iconName = focused ? 'home' : 'home-outline'
              }
              else if (rn === searchStack) {
                iconName = focused ? 'search' : 'search-outline' 
              }
              else if (rn == savedEventsStack) {
                iconName = focused ? 'bookmarks' : 'bookmarks-outline'
              }

              return <Ionicons name={iconName} size={size} color="#25355A"/>
            },
            tabBarShowLabel: false,
            headerShown: false
          })}
        >
          <Tab.Screen name={homeStack} component={HomeStackScreen} />
          <Tab.Screen name={searchStack} component={SearchStackScreen} />
          <Tab.Screen name={savedEventsStack} component={SavedEventsStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
};

export default App;