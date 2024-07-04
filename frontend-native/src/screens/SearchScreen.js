import { FlatList, View, StyleSheet, Text} from 'react-native';
import { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48
  }
});

const SearchScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <Text>SEARCH TO-DO</Text>
    </View>
  );
};

export default SearchScreen;