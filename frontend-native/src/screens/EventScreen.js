import { View, StyleSheet, Image, Pressable, Button, ScrollView } from 'react-native';
import Text from '../components/atomics/Text';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useState, useEffect } from 'react';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingBottom: 24,
        paddingHorizontal: 16,
        backgroundColor: '#f5f7fa',
        // marginTop: 24,
    },
    dateLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8
        // marginLeft: 16,
    },
    icon: {
        alignSelf: 'flex-end',
        // paddingRight: 8
    },
  });

const EventScreen = ({ route, navigation }) => {
    const { eventId, eventTitle, dateTime, location, eventSaved, setSaved} = route.params
    const [savedChild, setSavedChild] = useState(eventSaved)

    useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          title: eventTitle,
          headerBackTitle: "Back"
        });
    }, [navigation, route]);

    const handleOnPressSave = () => {
        // console.log("saved button pressed")
        setSaved(!eventSaved)
        setSavedChild(!savedChild)
        // TODO: implement local save 
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={require('../components/mock-event-image.png')} resizeMode='cover' style={{ width: '100%', height: 300, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginBottom: 16, paddingHorizontal: 16 }}/>
            <View style={styles.dateLine}>
                <Text color="textSecondary">{dateTime.toDateString()} - {dateTime.toLocaleTimeString()}</Text>
                <View style={styles.icon}>
                    <Pressable onPress={handleOnPressSave}>
                        <Ionicons name={savedChild ? "bookmark" : "bookmark-outline"} size={32} color="#007FA3" />
                    </Pressable>
                </View>
            </View>
            <Text fontSize="heading" fontWeight="bold" style={{ marginBottom: 8 }}>
                {eventTitle}
            </Text>
            <Text>
                Description of event Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </Text>

            <Text fontSize="subheading" fontWeight="bold" style={{ marginBottom: 8, marginTop: 16 }}>
                Location
            </Text>
            <Text>
                {location}
            </Text>
            {/* TODO: add social media icons that send user to respective links */}
            <Text fontSize="subheading" fontWeight="bold" style={{ marginBottom: 8, marginTop: 16 }}>
                About the club
            </Text>
            <Text>
            Get Lit Gaming is here to bring UofT students together to play board games and have a LIT time! We are a rapidly growing club, becoming founded in the summer of 2019. We think playing board games bring out the best (and worst!) in people and always creates memorable moments! Our goal is to teach you new games and allow you to meet lots of new people.
            {"\n"} {"\n"}Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Text>
        </ScrollView>
    );
  };
  
  export default EventScreen;