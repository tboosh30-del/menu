'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Crosshair } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    onAddressFound?: (address: string) => void;
}

function LocationMarker({ onLocationSelect, onAddressFound }: LocationMapProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    // Reverse geocoding function using Nominatim API
    const reverseGeocode = async (lat: number, lng: number) => {
        if (!onAddressFound) return;

        setIsLoadingAddress(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
            );
            const data = await response.json();

            if (data && data.display_name) {
                // Extract relevant address parts
                const address = data.address || {};
                const addressParts = [
                    address.road || address.street,
                    address.neighbourhood || address.suburb,
                    address.city || address.town || address.village,
                    address.state
                ].filter(Boolean);

                const formattedAddress = addressParts.join('، ') || data.display_name;
                onAddressFound(formattedAddress);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        } finally {
            setIsLoadingAddress(false);
        }
    };

    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
            reverseGeocode(lat, lng);
        },
    });

    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPos: [number, number] = [latitude, longitude];
                    setPosition(newPos);
                    map.flyTo(newPos, 15);
                    onLocationSelect(latitude, longitude);
                    reverseGeocode(latitude, longitude);
                },
                (error) => {
                    console.error('Error detecting location:', error);
                    alert('تعذر تحديد موقعك. الرجاء السماح بالوصول إلى الموقع أو اختيار موقعك على الخريطة.');
                }
            );
        } else {
            alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
        }
    };

    useEffect(() => {
        // Auto-detect location on mount
        detectLocation();
    }, []);

    return (
        <>
            {position && <Marker position={position} />}
            <div className="absolute top-4 left-4 z-[1000]">
                <button
                    type="button"
                    onClick={detectLocation}
                    className="bg-white hover:bg-gray-100 text-gray-900 p-3 rounded-lg shadow-lg transition-colors flex items-center gap-2"
                    disabled={isLoadingAddress}
                >
                    <Crosshair className="w-5 h-5" />
                    <span className="text-sm font-bold">
                        {isLoadingAddress ? 'جاري التحميل...' : 'تحديد موقعي'}
                    </span>
                </button>
            </div>
        </>
    );
}

export default function LocationMap({ onLocationSelect, onAddressFound }: LocationMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400 animate-pulse" />
            </div>
        );
    }

    // Default center: Cairo, Egypt
    const defaultCenter: [number, number] = [30.0444, 31.2357];

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border-2 border-gray-300">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={onLocationSelect} onAddressFound={onAddressFound} />
            </MapContainer>
        </div>
    );
}
