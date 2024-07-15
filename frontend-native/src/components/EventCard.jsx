import { View, StyleSheet, Image, Pressable, Button } from 'react-native';
import Text from './Text';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';


const styles = StyleSheet.create({
    cardContainer: {
        paddingBottom: 24,
        borderRadius: 16,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        backgroundColor: 'white',
        marginTop: 24,
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

const EventCard = ({ title, dateTime, location, imageLink, imageHeight = 200, eventSaved = false, id }) => {
    const navigation = useNavigation()
    const eventId = id
    const [saved, setSaved] = useState(eventSaved)
    
    const handleOnPressSave = () => {
        console.log("saved button pressed")
        setSaved(!saved)
        // TODO: implement local save 
    }

    const handleNavigate = () => {
        navigation.navigate('Event', {
            eventId,
            eventTitle: title,
            dateTime,
            location,
            eventSaved: saved
        });
    }

    return (
        <View style={styles.cardContainer}>
            <Pressable onPress={handleNavigate}>
                {/* <Image source={require('./mock-event-image.png')} resizeMode='cover' style={{ width: '100%', height: imageHeight, borderRadius: 16, marginBottom: 16 }}/> */}
                <Image source={{ uri: 
                    'https://scontent-yyz1-1.cdninstagram.com/v/t51.29350-15/434149711_950686900014414_3745898714879183374_n.heic?stp=dst-jpg_e35&_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=106&_nc_ohc=FF8NCzkREp8Q7kNvgFXR72Z&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzMyODkzMDUxNjA0MzY1NDg4NQ%3D%3D.2-ccb7-5&oh=00_AYCdpjLcVO2N0vzuPxRUHAg-Jxb3IlftL2IElm1Wx6uCTg&oe=668CD89A&_nc_sid=8b3546'
                }} resizeMode='cover' style={{ width: '100%', height: imageHeight, borderRadius: 16, marginBottom: 16 }}/>
            </Pressable>
            <View style={styles.cardContent}>
                <Pressable onPress={handleNavigate}>
                    <View style={{ flexDirection: 'column', gap: 12 }}>
                        <Text fontWeight='bold'>{title}</Text>
                        <Text color="textSecondary">{dateTime.toDateString()} - {dateTime.toLocaleTimeString()}</Text>
                        <Text>{location}</Text>
                    </View>
                </Pressable>
                <View style={styles.icon}>
                    <Pressable onPress={handleOnPressSave}>
                        <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={32} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
  };
  
  export default EventCard;