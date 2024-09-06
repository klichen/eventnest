import { useState, useEffect } from 'react';
const useGetUpcomingEvents = () => {
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState(false);

    const fetchUpcomingEvents = async () => {
        setLoading(true);

        try {
            const url = 'https://clubclubgo.website/upcoming'
            const response = await fetch(url, {
                method: "GET",
            });
            const json = await response.json();

            setLoading(false);
            setEvents(json);
        } catch (error) {
            console.error(error.message)
        }

    };

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    return { events, loading, refetch: fetchUpcomingEvents };
};

export default useGetUpcomingEvents;