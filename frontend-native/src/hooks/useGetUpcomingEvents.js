import { useState, useEffect } from 'react';
const useGetUpcomingEvents = () => {
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState(false);

    const fetchUpcomingEvents = async () => {
        setLoading(true);

        try {
            const url = 'http://18.118.132.176:8000/upcoming'
            const response = await fetch(url, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "25"
                })
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