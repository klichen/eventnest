import { View, StyleSheet, Image, Pressable } from 'react-native';
import Text from './atomics/Text';
import Button from './atomics/Button';

const SearchEmptyState = ({ handleClearSearch }) => {
    return (
        <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 24 }}>
            <Text>Search Not Found</Text>
            <Button
                title="Clear Search"
                textColor='#007FA3'
                textWeight='medium'
                onPress={() => {
                    handleClearSearch()
                }}
            />
        </View>
    )
}

export default SearchEmptyState