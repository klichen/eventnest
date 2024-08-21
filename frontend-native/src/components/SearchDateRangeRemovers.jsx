import { View, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import Text from './atomics/Text';
import Button from './atomics/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchDateRangeRemovers = ({ selectedStartDate, selectedEndDate, handleClearDates, confirmedSearchPhrase, handleClearSearch, searchingCategory }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startDate = selectedStartDate ? selectedStartDate.getDate() : null
    const startMonth = selectedStartDate ? months[selectedStartDate.getMonth()] : null
    const endDate = selectedEndDate ? selectedEndDate.getDate() : null
    const endMonth = selectedEndDate ? months[selectedEndDate.getMonth()] : null
    return (
        <View style={styles.container}>
            {/* <View style={styles.clearBtn}>
                <Button
                    title="Clear"
                    iconName="close"
                    iconColor="#007FA3"
                    iconSize={24}
                    textSize={14}
                    textColor='#007FA3'
                    textWeight='medium'
                    onPress={handleClearDates}
                />
            </View> */}
            {(!!confirmedSearchPhrase || searchingCategory) ?
                <TouchableOpacity style={styles.dateDisplay} onPress={handleClearSearch}>
                    {/* <Ionicons name="calendar-clear-outline" size={24} color="white" /> */}
                    <Ionicons name="close" size={24} color="white" />
                    <Text color="white">Clear search</Text>
                </TouchableOpacity>
                : null
            }
            {!!selectedStartDate ?
                !!selectedEndDate && <TouchableOpacity style={styles.dateDisplay} onPress={handleClearDates}>
                    {/* <Ionicons name="calendar-clear-outline" size={24} color="white" /> */}
                    <Ionicons name="close" size={24} color="white" />
                    <Text color="white">{startMonth} {startDate} - {endMonth} {endDate}</Text>
                </TouchableOpacity>
                : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8
    },
    dateDisplay: {
        flexDirection: 'row',
        flexGrow: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
        marginTop: 8,
        padding: 8,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#25355A',
        borderRadius: 8,
        backgroundColor: '#25355A'

    },
    clearBtn: {
        flexDirection: 'row',
        flexGrow: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
        marginTop: 8,
        padding: 8,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#007FA3',
        borderRadius: 8,
    }
});

export default SearchDateRangeRemovers