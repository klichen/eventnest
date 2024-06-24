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

// screen route names
const homeRoute = 'Home'
const searchRoute = 'Search'
const savedEventsRoute = 'Saved'

const Tab = createBottomTabNavigator();

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
          <Tab.Screen name={homeRoute} component={HomeScreen} />
          <Tab.Screen name={searchRoute} component={SearchScreen} />
          <Tab.Screen name={savedEventsRoute} component={SavedEventsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
};

export default App;