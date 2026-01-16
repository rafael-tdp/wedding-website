import Section from "@/components/ui/Section";
import Map from "@/components/location/Map";

interface LocationMapProps {
  address: string;
  lat: number;
  lng: number;
}

export default function LocationMap({ address, lat, lng }: LocationMapProps) {
  return (
    <Section variant="default" spacing="md">
      <div className="max-w-5xl mx-auto">
        <Map
          address={address}
          lat={lat}
          lng={lng}
          zoom={15}
        />
      </div>
    </Section>
  );
}
