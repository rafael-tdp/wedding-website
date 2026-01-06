import Section from "@/components/ui/Section";
import Map from "@/components/lieu/Map";

interface LieuMapProps {
  address: string;
  lat: number;
  lng: number;
}

export default function LieuMap({ address, lat, lng }: LieuMapProps) {
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
