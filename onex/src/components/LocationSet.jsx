import Select from 'react-select';
import { useEffect, useState } from 'react';

export default function LocationSet() {
    // State to store the formatted options for react-select
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetch("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
            headers: {
                'X-RapidAPI-KEY': '522115318bmshaae7b011286a82bp104622jsn3c209c7fc287', // Replace with your actual API key
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        })
        .then((res) => res.json())
        .then((data) => {
            // Format data for react-select: { value, label }
            const formatted = (data || []).map(city => ({
                value: city.iso2 || city.id || city.name,
                label: city.name
            }));
            setOptions(formatted);
        })
        .catch((err) => console.error("Error fetching states data: ", err));
    }, []); // Only run once on mount

    return (
        <div className="flex">
            <Select options={options} className="text-[1rem]" placeholder="Set Location" />
        </div>
    );
}