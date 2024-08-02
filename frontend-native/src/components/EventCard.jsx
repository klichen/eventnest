import { View, StyleSheet, Image, Pressable } from 'react-native';
import Text from './atomics/Text';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { parseISOString } from '../utils/helperFunctions';

const EventCard = ({ title, description, startDatetime, endDatetime, location, imageLink, imageHeight = 200, eventSaved = false, id, clubId, eventLink }) => {
    const navigation = useNavigation()
    const eventId = id
    const dateTime = startDatetime ? parseISOString(startDatetime) : null
    const [saved, setSaved] = useState(eventSaved)


    const handleOnPressSave = () => {
        setSaved(!saved)
        // TODO: implement local save 
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
            eventSaved: saved,
            setSaved,
        });
    }

    return (
        <View style={styles.cardContainer}>
            <Pressable onPress={handleNavigate} style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }
            ]}>
                <Image source={{ uri: imageLink }} resizeMode='cover' style={{ width: '100%', height: imageHeight, borderRadius: 16, marginBottom: 16 }} />
            </Pressable>
            <View style={styles.cardContent}>
                <Pressable onPress={handleNavigate}>
                    <View style={{ flexDirection: 'column', gap: 12 }}>
                        <Text fontWeight='bold'>{title}</Text>
                        {dateTime && <Text color="textSecondary">{dateTime.toDateString()} - {dateTime.toLocaleTimeString()}</Text>}
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