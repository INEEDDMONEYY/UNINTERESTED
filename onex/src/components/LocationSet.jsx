import { useEffect, useState } from "react";
import Select from "react-select";
import { MapPin, Compass } from "lucide-react";

export default function LocationSet({ onLocationChange }) {
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🗺️ U.S. state options (can be expanded)
  const STATE_OPTIONS = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana",
    "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
    "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
    "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ];

  // 🌎 Detect user location automatically
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser.");
      setLoading(false);
      buildStateOptions();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        const detected = {
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown City",
          state: data.address.state || "Unknown State",
        };

        const label = `${detected.city}, ${detected.state}`;
        setLocation({ label, value: detected });
        setLoading(false);

        localStorage.setItem("userLocation", JSON.stringify(detected));
        if (onLocationChange) onLocationChange(detected);
      },
      (err) => {
        console.error("Geolocation error:", err);
        buildStateOptions();
        setLoading(false);
      }
    );
  }, [onLocationChange]);

  // 🧭 Build dropdown options (searchable by any state)
  const buildStateOptions = () => {
    const formatted = STATE_OPTIONS.map((state) => ({
      value: { state, city: "" },
      label: state,
    }));
    setOptions(formatted);
  };

  useEffect(() => {
    buildStateOptions();
  }, []);

  const handleChange = (selected) => {
    setManualLocation(selected);
    localStorage.setItem("userLocation", JSON.stringify(selected.value));
    if (onLocationChange) onLocationChange(selected.value);
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full max-w-sm">
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Compass className="w-4 h-4 animate-spin text-pink-400" />
          <p>Detecting location...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 w-full">
            <MapPin className="w-5 h-5 text-pink-500" />
            <Select
              options={options}
              value={manualLocation || location}
              onChange={handleChange}
              className="text-[1rem] flex-1"
              placeholder="Search or select your state"
              isSearchable
              isClearable
            />
          </div>

          {location && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-pink-400" />
              Current: {location.label}
            </p>
          )}
        </>
      )}
    </div>
  );
}
