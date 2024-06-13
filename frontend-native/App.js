import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RepositoryList from './src/components/RepositoryList'
import FlexPage from './src/components/FlexPage';

const Stack = createNativeStackNavigator();

const App = () => {
  console.log(Constants.expoConfig);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RepositoryList} />
          <Stack.Screen name="Flex" component={FlexPage} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
};

export default App;