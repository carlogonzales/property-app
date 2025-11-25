'use client';

import {useEffect, useState} from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import {setDefaults, fromAddress} from "react-geocode";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import pin from '@/assets/images/pin.svg';
import Map, {Marker} from "react-map-gl/mapbox";

const PropertyMap = ({property}) => {

    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 12,
        width: '100%',
        height: '500px',
    });
    const [loading, setLoading] = useState(true);
    const [geocodeError, setGeocodeError] = useState(false);

    setDefaults({
        key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
        language: 'en-ph',
        region: 'ph',
    })

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const res = await fromAddress(`${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`);
                if (res.results.length === 0) {
                    setGeocodeError(true);
                    setLoading(false);
                    return;
                }
                if (res.status === 'OK') {
                    const location = res.results[0].geometry.location;
                    setLat(location.lat);
                    setLng(location.lng);
                    setViewport({
                        ...viewport,
                        latitude: location.lat,
                        longitude: location.lng,
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setGeocodeError(true);
                setLoading(false);
            }
        };
        fetchCoordinates();
    }, []);

    if (loading) {
        return <Spinner loading={loading} />;
    }

    if (geocodeError) {
        return (
            <div className="text-xl">No location data found.</div>
        );
    }

    return !loading && (
        <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={{
                ...viewport
            }}
            style={{width: '100%', height: 500}}
            mapStyle='mapbox://styles/mapbox/streets-v9'>
            <Marker longitude={lng} latitude={lat} >
                <Image src={pin} alt='' width={40} height={40} />
            </Marker>
        </Map>
    );
};

export default PropertyMap;