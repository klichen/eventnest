import { useState, useEffect } from 'react';
const useGetUpcomingEvents = () => {
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState(false);

    const fetchUpcomingEvents = async () => {
        setLoading(true);

        try {
            const url = 'https://2b6a-138-51-90-242.ngrok-free.app/upcoming'
            const response = await fetch(url, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "25"
                })
            });
            const json = await response.json();

            setLoading(false);
            setEvents(json);
            // console.log(json)
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