import { View, StyleSheet, Image, Pressable } from 'react-native';
import Text from './atomics/Text';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import { parseISOString } from '../utils/helperFunctions';
import { setEventId, removeEventId } from '../utils/AsyncStorage';
import useEventSavedStatus from '../hooks/useEventSavedStatus';

const placeholderImage = 'https://reactjs.org/logo-og.png';

const EventCard = ({ title, description, startDatetime, endDatetime, location, imageLink, imageHeight = 200, id, clubId, eventLink }) => {
    const navigation = useNavigation();
    const eventId = "event" + id;
    const dateTime = startDatetime ? parseISOString(startDatetime) : null;
    const [saved, setSaved] = useEventSavedStatus(eventId);
    const imageUri = !!imageLink ? imageLink : placeholderImage;

    const handleOnPressSave = () => {
        if (saved) {
            removeEventId(eventId);
        }
        else {
            setEventId(eventId);
        }
        setSaved(!saved);
    }


    const handleNavigate = () => {
        navigation.navigate('Event', {
            eventId,
            clubId,
            eventTitle: title,
            eventDescription: description,
            startDatetime,
            endDatetime,
            location,
            imageLink,
            eventLink,
        });
    }

    return (
        <View style={styles.cardContainer}>
            <Pressable onPress={handleNavigate} style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }
            ]}>
                <Image source={{ uri: imageUri }} resizeMode='cover' style={{ width: '100%', height: imageHeight, borderRadius: 16, marginBottom: 16 }} />
            </Pressable>
            <View style={styles.cardContent}>
                <Pressable onPress={handleNavigate}>
                    <View style={{ flexDirection: 'column', gap: 12, width: '95%' }}>
                        <Text fontWeight='bold'>{title}</Text>
                        {dateTime && <Text color="textSecondary">{dateTime.toDateString()} - {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
                        <Text>{location}</Text>
                    </View>
                </Pressable>
                <View style={styles.icon}>
                    <Pressable onPress={handleOnPressSave}>
                        <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={32} color="#007FA3" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        paddingBottom: 24,
        borderRadius: 16,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        backgroundColor: 'white',
        marginBottom: 24,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
    },
    icon: {
        alignSelf: 'flex-end',
        paddingRight: 8
    },
});

export default EventCard;