import { useState, useEffect } from 'react';
const useGetRecentlyAddedEvents = () => {
    const [recentlyAddedEvents, setRecentlyAddedEvents] = useState();
    const [loading, setLoading] = useState(false);

    const fetchRecentlyAddedEvents = async () => {
        setLoading(true);

        try {
            const url = 'https://clubclubgo.website/new'
            const response = await fetch(url, {
                method: "GET",
            });
            const json = await response.json();

            setLoading(false);
            setRecentlyAddedEvents(json.slice(0, 3));
        } catch (error) {
            console.error(error.message)
        }

    };

    useEffect(() => {
        fetchRecentlyAddedEvents();
    }, []);

    return { recentlyAddedEvents, loading, refetch: fetchRecentlyAddedEvents };
};

export default useGetRecentlyAddedEvents;