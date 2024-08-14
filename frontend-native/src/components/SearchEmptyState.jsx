import { View } from 'react-native';
import Text from './atomics/Text';
import Button from './atomics/Button';

const SearchEmptyState = ({ searchPhrase, hasDateRange, handleClearSearch }) => {
    if (searchPhrase) {
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
    else if (hasDateRange) {
        return (
            <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 24 }}>
                <Text>No events happening these days...</Text>
            </View>
        )
    }
    else {
        return (
            <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 24 }}>
                <Text>{'There are currently no events :('}</Text>
            </View>
        )
    }
}

export default SearchEmptyState