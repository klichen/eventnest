import { useState, useEffect, useCallback } from 'react';

const useSearchEvents = () => {
    const [searchedEvents, setSearchedEvents] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    // const [savedEventIds, setSavedEventIds] = useState([]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        
        // Extract the month, day, and year
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${month}-${day}-${year}`;
    }


    const fetchSearchedEvents = useCallback(async ({ startDate = null, endDate = null, searchString = null }) => {
        setSearchLoading(true);
        try {
            const baseUrl = 'https://clubclubgo.website/search';
            const params = new URLSearchParams();
            if (startDate) {
                params.append('start_date', formatDate(startDate))
            }
            if (endDate) {
                params.append('end_date', formatDate(endDate))
            }
            if (searchString) {
                params.append('search', searchString)
            }
            const url = new URL(`${baseUrl}?${params}`);
            // console.log(url)

            const response = await fetch(url, {
                method: "GET",
            });
            const json = await response.json();
            // console.log(json);
            const data = json.events;
            // console.log(data);
            setSearchLoading(false);
            return data;
        } catch (error) {
            console.error(error.message);
            return []
        }
    }, []);

    const fetchSearchedEventsByCategory = useCallback(async ({ searchString = null, startDate = null, endDate = null }) => {
        setSearchLoading(true);
        try {
            const baseUrl = 'https://clubclubgo.website/category';
            const params = new URLSearchParams();
            if (startDate) {
                params.append('start_date', formatDate(startDate))
            }
            if (endDate) {
                params.append('end_date', formatDate(endDate))
            }
            if (searchString) {
                params.append('search', searchString)
            }
            const url = new URL(`${baseUrl}?${params}`);

            const response = await fetch(url, {
                method: "GET",
            });
            const json = await response.json();
            // console.log(json);
            const data = json.events;
            // console.log(data);
            setSearchLoading(false);
            return data;
        } catch (error) {
            console.error(error.message);
            return []
        }
    }, []);

    // const fetchMockData = async () => {
    //     const savedEventIds = await getAllEventIds();
    //     const newEvents = reformatData(mockData).map(section => ({
    //         ...section,
    //         events: section.events.filter(event => savedEventIds.includes('event' + event.id))
    //     })).filter(section => section.events.length > 0);
    //     setSavedEvents(newEvents);
    // };

    return { searchedEvents, setSearchedEvents, searchLoading, fetchSearchedEvents, fetchSearchedEventsByCategory };
};

export default useSearchEvents;