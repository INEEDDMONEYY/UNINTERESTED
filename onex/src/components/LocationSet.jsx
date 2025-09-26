import Select from 'react-select';
import { useEffect, useState } from 'react';

export default function LocationSet() {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10", {
            method: "GET",
            headers: {
                'X-RapidAPI-Key': '522115318bmshaae7b011286a82bp104622jsn3c209c7fc287',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        })
        .then((res) => res.json())
        .then((data) => {
            const formatted = data.data.map(city => ({
                value: city.id,
                label: `${city.name}, ${city.country}`
            }));
            setOptions(formatted);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching cities: ", err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="flex">
            {loading ? (
                <p>Loading locations...</p>
            ) : (
                <Select options={options} className="text-[1rem]" placeholder="Set Location" />
            )}
        </div>
    );
}
