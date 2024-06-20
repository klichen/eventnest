import { FlatList, View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48
  }
});

const SavedEventsScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <Text>SAVED EVENTS TO-DO</Text>
    </View>
  );
};

export default SavedEventsScreen;