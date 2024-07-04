import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import RepositoryList from './src/components/RepositoryList'
// import FlexPage from './src/components/FlexPage';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SavedEventsScreen from './src/screens/SavedEventsScreen';
import EventScreen from './src/screens/EventScreen';

// screen route names
const homeStack = 'HomeStack'
const homeRoute = 'Home'
const eventRoute = 'Event'
const searchRoute = 'Search'
const savedEventsRoute = 'Saved'

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={homeRoute} component={HomeScreen} />
      <HomeStack.Screen name={eventRoute} component={EventScreen} />
    </HomeStack.Navigator>
  )
}

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
              else if (rn === searchRoute) {
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
          <Tab.Screen name={homeStack} component={HomeStackScreen} />
          <Tab.Screen name={searchRoute} component={SearchScreen} />
          <Tab.Screen name={savedEventsRoute} component={SavedEventsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
};

export default App;