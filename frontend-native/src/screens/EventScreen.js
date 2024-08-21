import { View, StyleSheet, Image, Pressable, ScrollView, Linking } from 'react-native';
import Text from '../components/atomics/Text';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useEffect } from 'react';
import { parseISOString } from '../utils/helperFunctions';
import useGetClubInformation from '../hooks/useGetClubInformation';
import LoadSkeleton from '../components/LoadSkeleton';
import { setEventId, removeEventId } from '../utils/AsyncStorage';
import useEventSavedStatus from '../hooks/useEventSavedStatus';


const EventScreen = ({ route, navigation }) => {
    const { eventId, clubId, eventTitle, eventDescription, startDatetime, endDatetime, imageLink, eventLink, location } = route.params
    const startDate = startDatetime ? parseISOString(startDatetime) : null
    const endDate = endDatetime ? parseISOString(endDatetime) : null
    const { clubInfo = {}, loading } = useGetClubInformation(clubId)
    const { description: clubDescription, name: clubName, website_type, website_link } = clubInfo
    const [saved, setSaved] = useEventSavedStatus(eventId)
    const instagramHandle = website_type === "IN" ? website_link.match(/instagram\.com\/([a-zA-Z0-9._]+)/)[1] : '';


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: eventTitle,
            headerBackTitle: "Back"
        });
    }, [navigation, route]);

    const handleOnPressSave = () => {
        if (saved) {
            removeEventId(eventId);
        }
        else {
            setEventId(eventId);
        }
        setSaved(!saved)
    }

    const handleOnPressLearnMore = () => {
        Linking.openURL(eventLink)
    }

    const handleOnPressClubLink = () => {
        Linking.openURL(website_link)
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
            <Image source={{ uri: imageLink }} resizeMode='cover' style={{ width: '100%', height: 300, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginBottom: 16, paddingHorizontal: 16 }} />
            <View style={styles.dateLine}>
                {startDate && endDate && <Text color="textSecondary" fontSize='body2'>{startDate.toDateString()}, {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
                {startDate && !endDate && <Text color="textSecondary">{startDate.toDateString()}, {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </Text>}
                <View style={styles.saveIcon}>
                    <Pressable onPress={handleOnPressSave}>
                        <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={32} color="#007FA3" />
                    </Pressable>
                </View>
            </View>

            <Text fontSize="heading" fontWeight="bold" style={{ marginBottom: 8 }}>
                {eventTitle}
            </Text>
            <Text>
                {eventDescription}
            </Text>
            <Pressable onPress={handleOnPressLearnMore} style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }
            ]}>
                <View style={styles.learnMore}>
                    <Text color="textSecondary" fontSize="body2">
                        Learn more
                    </Text>
                    <Ionicons name={"open-outline"} size={24} color="#007FA3" />
                </View>
            </Pressable>

            <Text fontSize="subheading" fontWeight="bold" style={{ marginBottom: 8, marginTop: 16 }}>
                Location
            </Text>
            <Text>
                {location}
            </Text>

            <Text fontSize="subheading" fontWeight="bold" style={{ marginBottom: 8, marginTop: 16 }}>
                About the club
            </Text>
            {!loading ?
                <View>
                    <Text>
                        {!!clubDescription && clubDescription}
                    </Text>
                    {!!instagramHandle && <Pressable onPress={handleOnPressClubLink} style={({ pressed }) => [
                        { opacity: pressed ? 0.5 : 1.0 }
                    ]}>
                        <View style={styles.learnMore}>
                            <Text color="textSecondary" fontSize="body2">
                                {instagramHandle}
                            </Text>
                            <Ionicons name={"logo-instagram"} size={24} color="#007FA3" />
                        </View>
                    </Pressable>}
                </View>
                :
                <View style={styles.skeletons}>
                    <LoadSkeleton />
                    <LoadSkeleton width={'80%'} />
                    <LoadSkeleton width={'60%'} />
                </View>}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 12,
        backgroundColor: '#f5f7fa',
    },
    dateLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 8
    },
    dateLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 8
    },
    learnMore: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 4,
        alignItems: 'center',
        marginTop: 4
    },
    saveIcon: {
        alignSelf: 'flex-end',
    },
    skeletons: {
        flexDirection: 'column',
        gap: 4
    }
});

export default EventScreen;