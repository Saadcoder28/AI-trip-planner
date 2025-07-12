import Hero from "../components/Hero";
import TripForm from "../components/TripForm";

export default function Home({ user }) {
  return (
    <div className="flex flex-col items-center pt-8 pb-16">
      <Hero />
      <div className="w-full max-w-3xl mt-12">
        <TripForm user={user} />
      </div>
    </div>
  );
}
