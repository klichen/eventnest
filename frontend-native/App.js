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
const homeRoute = 'Home'
const eventRoute = 'Event'
const searchStack = 'SearchStack'
const searchRoute = 'Search'
const savedEventsRoute = 'Saved'

const Tab = createBottomTabNavigator();
const SearchStack = createNativeStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name={searchRoute} component={SearchScreen} />
      <SearchStack.Screen name={eventRoute} component={EventScreen} />
    </SearchStack.Navigator>
  )
}

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={homeRoute}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size}) => {
              let iconName;
              let rn = route.name;

              if (rn === homeRoute) {
                iconName = focused ? 'home' : 'home-outline'
              }
              else if (rn === searchStack) {
                iconName = focused ? 'search' : 'search-outline' 
              }
              else if (rn == savedEventsRoute) {
                iconName = focused ? 'bookmarks' : 'bookmarks-outline'
              }

              return <Ionicons name={iconName} size={size} color="#ffa700"/>
            },
            tabBarShowLabel: false,
            headerShown: false
          })}
        >
          <Tab.Screen name={homeRoute} component={HomeScreen} />
          <Tab.Screen name={searchStack} component={SearchStackScreen} />
          <Tab.Screen name={savedEventsRoute} component={SavedEventsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
};

export default App;