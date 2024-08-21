import { View } from 'react-native';
import Text from './atomics/Text';
import Button from './atomics/Button';

const SearchEmptyState = ({ searchPhrase, hasDateRange, refetch }) => {
    if (searchPhrase) {
        return (
            <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 24 }}>
                <Text>Search Not Found</Text>
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
                <Button
                    title="Refresh"
                    textColor='#007FA3'
                    textWeight='medium'
                    onPress={refetch}
                />
            </View>
        )
    }
}

export default SearchEmptyState