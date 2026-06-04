import { notFound } from "next/navigation";
import { days } from "@/data/curriculum";
import { DayGate } from "@/components/lesson/DayGate";

export function generateStaticParams() {
  return days.map((d) => ({ id: String(d.id) }));
}

export default function DayPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const day = days.find((d) => d.id === id);
  if (!day) notFound();
  return <DayGate day={day} />;
}
