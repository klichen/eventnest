import { View, StyleSheet, Pressable } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: 'purple',
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  button: {
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 3,
    borderRadius: 4,
    backgroundColor: "yellow"
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'purple',
  },
});

const AppBar = ({ nav }) => {
  return (
  <View style={styles.container}>
    <Pressable style={styles.button} onPress={() => nav.navigate('Home')}>
        <Text style={styles.text}>{"Home"}</Text>
    </Pressable>
    <Pressable style={styles.button} onPress={() => nav.navigate('Flex')}>
        <Text style={styles.text}>{"Flex"}</Text>
    </Pressable>
  </View>
  );
};

export default AppBar;