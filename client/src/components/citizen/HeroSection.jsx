import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden rounded-xl bg-primary text-white p-10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444723121867-7a241cacace9')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 max-w-3xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-black">
          Better Neighborhoods Start With You.
        </h1>
        <p className="text-lg text-white/90">
          Report local issues, track progress, and engage with your community authorities in real-time.
        </p>
        <button onClick={()=>navigate("/citizen/report")} className="text-black text-primary px-6 py-3 rounded-lg font-bold flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined">add_circle</span>
          Report an Issue Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
