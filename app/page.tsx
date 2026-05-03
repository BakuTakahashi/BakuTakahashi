import { ParkingFinder } from "@/components/ParkingFinder";
import { fetchParkings } from "@/lib/parkings";

export default async function HomePage() {
  const parkings = await fetchParkings();
  return <ParkingFinder parkings={parkings} />;
}
