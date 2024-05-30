import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import Text from './Text'
import AppBar from './AppBar';

const styles = StyleSheet.create({
    flexContainer: {
      flexDirection: 'row',
    //   marginTop: 50,
      justifyContent: "flex-end",
      alignContent: 'center',
      gap: 25,
      flexWrap: "wrap"
    },
    flexItemA: {

        flexGrow: 1,
        backgroundColor: 'green',
    },
    flexItemB: {
        flexGrow: 0,
        backgroundColor: 'blue',
    },
    flexNav: {
        flexGrow: 0
    }
  });

const Main = () => {
    return (
        <View>
            <AppBar/>
            <View style={styles.flexContainer}>
                <View style={styles.flexItemA}>
                    <Text>Flex item A</Text>
                </View>
                <View style={styles.flexItemB}>
                    <Text>Flex item B</Text>
                </View>
                <View style={styles.flexItemB}>
                    <Text>Flex item C</Text>
                </View>
            </View>
        </View>
      );
  };

export default Main;