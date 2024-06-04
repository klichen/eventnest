import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    item: {
        fontSize: 24
    }
  });

const RepositoryItem = ({ id, fullName, description, language, forksCount, ratingAverage, reviewCount }) => {
    return (
        <View style={styles.container}>
            <Text>Full name: {fullName} </Text>
            <Text>Description: {description} </Text>
            <Text>Language: {language}</Text>
        </View>
    );
  };
  
  export default RepositoryItem;