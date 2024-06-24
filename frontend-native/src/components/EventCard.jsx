import { View, StyleSheet, Image } from 'react-native';
import Text from './Text';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useState } from 'react';


const styles = StyleSheet.create({
    cardContainer: {
        // paddingTop: 24,
        paddingBottom: 24,
        borderRadius: 16,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        backgroundColor: 'white',
        marginTop: 24,
        // alignSelf: 'stretch'
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginLeft: 16,
    },
    icon: {
        alignSelf: 'flex-end',
        paddingRight: 8
    },
  });

const EventCard = ({ title, dateTime, location, imageLink, imageHeight = 200,  }) => {
    return (
        <View style={styles.cardContainer}>
            <Image source={require('./mock-event-image.png')} resizeMode='cover' style={{ width: '100%', height: imageHeight, borderRadius: 16, marginBottom: 16 }}/>
            <View style={styles.cardContent}>
                <View style={{ flexDirection: 'column', gap: 12 }}>
                    <Text fontWeight='bold'>{title}</Text>
                    <Text color="textSecondary">{dateTime.toDateString()} - {dateTime.toLocaleTimeString()}</Text>
                    <Text>{location}</Text>
                </View>
                <View style={styles.icon}>
                    <Ionicons name="bookmark-outline" size={32} />
                </View>
            </View>
        </View>
    );
  };
  
  export default EventCard;