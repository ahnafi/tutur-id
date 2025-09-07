import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Custom marker icon
const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapData {
    province: string;
    coordinates: [number, number];
    story_count: number;
    stories: Array<{
        id: number;
        title: string;
        slug: string;
        image?: string;
        total_reads: number;
        is_official: boolean;
        category?: string;
        creator?: string;
    }>;
}

interface InteractiveMapProps {
    mapData: MapData[];
    onProvinceClick: (province: string, stories: MapData['stories']) => void;
}

// Component to handle map events
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MapEvents({ onProvinceClick, mapData }: { onProvinceClick: InteractiveMapProps['onProvinceClick']; mapData: MapData[] }) {
    const map = useMap();

    useEffect(() => {
        // Set initial view to center of Indonesia
        map.setView([-2.5, 118], 5);
    }, [map]);

    return null;
}

export function InteractiveMap({ mapData, onProvinceClick }: InteractiveMapProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

    const handleMarkerClick = (province: string, stories: MapData['stories']) => {
        setSelectedProvince(province);
        onProvinceClick(province, stories);
    };

    return (
        <div className="relative h-96 w-full overflow-hidden rounded-lg border shadow-lg md:h-[500px] lg:h-[600px]">
            <MapContainer center={[-2.5, 118] as LatLngExpression} zoom={5} style={{ height: '100%', width: '100%' }} className="rounded-lg">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapEvents onProvinceClick={onProvinceClick} mapData={mapData} />

                {mapData.map((data) => (
                    <Marker
                        key={data.province}
                        position={data.coordinates as LatLngExpression}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(data.province, data.stories),
                        }}
                    >
                        <Popup>
                            <div className="min-w-[200px] text-center">
                                <h3 className="text-lg font-semibold">{data.province}</h3>
                                <p className="mb-2 text-sm text-muted-foreground">{data.story_count} cerita tersedia</p>
                                <button
                                    onClick={() => handleMarkerClick(data.province, data.stories)}
                                    className="w-full rounded bg-primary px-3 py-1 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Lihat Cerita
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute top-4 right-4 rounded-lg border bg-white/90 p-3 shadow-lg backdrop-blur-sm">
                <h4 className="mb-2 text-sm font-semibold">Legenda</h4>
                <div className="flex items-center gap-2 text-xs">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <span>Provinsi dengan cerita</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Klik marker untuk melihat cerita</div>
            </div>
        </div>
    );
}
