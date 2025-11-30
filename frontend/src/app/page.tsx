import CarList from "@/components/CarList";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-tight text-gray-900 dark:text-white">
        Our Car Collection
      </h1>
      <CarList />
    </div>
  );
}
