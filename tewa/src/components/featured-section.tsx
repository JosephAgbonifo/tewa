import { FeaturedPerson } from "@/types/api";
import FeaturedFrame from "./featured-frame";
import FeaturedStrip from "./featured-strip";

export default function FeaturedSection({
  people,
}: {
  people: FeaturedPerson[];
}) {
  if (people.length === 0) return null;
  const [current, ...past] = people;

  return (
    <div className="mb-8">
      <FeaturedFrame key={current.id} person={current} />
      <FeaturedStrip people={past} />
    </div>
  );
}
