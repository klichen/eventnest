import { useState, useEffect, useCallback } from 'react';
import { getAllEventIds } from '../utils/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';

const useGetSavedEvents = () => {
    const [savedEvents, setSavedEvents] = useState();
    const [loading, setLoading] = useState(false);

    const mockData = [
        {
            "id": 1,
            "club_id": "http://2b6a-138-51-90-242.ngrok-free.app/club/1/",
            "title": "Board games Night",
            "start_datetime": "2024-08-10T18:00:00Z",
            "end_datetime": "2024-08-10T22:00:00Z",
            "location": "Wilson Hall 2002",
            "event_link": "https://www.instagram.com/p/C2GJxNiRAc8",
            "image_link": "https://www.instagram.com/p/C2GJxNiRAc8/media",
            "description": "Join us on January 15th in Wilson Hall 2002 for board games (Up the stairs on the main entrance at 40 Willcocks St and to the left)!"
        },
        {
            "id": 2,
            "club_id": "http://2b6a-138-51-90-242.ngrok-free.app/club/2/",
            "title": "Cheer for Our Team at UEFA EURO 2024!",
            "start_datetime": "2024-08-24T18:00:00Z",
            "end_datetime": "2024-08-24T22:00:00Z",
            "location": "Rivals Sports Pub, YorkU",
            "event_link": "https://www.instagram.com/p/C8hV50jAy90",
            "image_link": "https://www.instagram.com/p/C8hV50jAy90/media",
            "description": "Join ASU, AAY, and Soccer World at YorkU to cheer on the team during their third game at the UEFA EURO 2024. Wear your best jersey and show your support!"
        }
    ]

    const formatDate = (dateString) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const reformatData = (data) => {
        const groupedEvents = {};

        data.forEach(event => {
            const dateKey = formatDate(event.start_datetime);

            if (!groupedEvents[dateKey]) {
                groupedEvents[dateKey] = {
                    date: dateKey,
                    events: []
                };
            }

            groupedEvents[dateKey].events.push({
                id: event.id,
                clubId: event.club_id,
                startDatetime: event.start_datetime,
                endDatetime: event.end_datetime,
                eventTitle: event.title,
                eventDescription: event.description,
                location: event.location,
                imageLink: event.image_link,
                eventLink: event.event_link
            });
        });

        return Object.values(groupedEvents);
    };

    const fetchSavedEvents = async () => {
        setLoading(true);
        try {
            const eventIds = await getAllEventIds();
            const baseUrl = 'https://2b6a-138-51-90-242.ngrok-free.app/events';
            const url = new URL(baseUrl);
            eventIds.forEach(id => url.searchParams.append('id', id));

            const response = await fetch(url, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "25"
                })
            });
            const json = await response.json();
            const data = reformatData(json)
            setLoading(false);
            setSavedEvents(data);
        } catch (error) {
            console.error(error.message)
        }

    };

    const fetchMockData = async () => {
        const savedEventIds = await getAllEventIds();
        const newEvents = reformatData(mockData).map(section => ({
            ...section,
            events: section.events.filter(event => savedEventIds.includes('event' + event.id))
        })).filter(section => section.events.length > 0);
        setSavedEvents(newEvents);
    };

    // useEffect(() => {
    //     // fetchSavedEvents();
    //     fetchMockData();
    //     // setSavedEvents(reformatData(mockData))
    // }, []);

    useFocusEffect(
        useCallback(() => {
            fetchMockData();
        }, [])
    );

    return { savedEvents, setSavedEvents, loading, refetch: fetchMockData };
};

export default useGetSavedEvents;