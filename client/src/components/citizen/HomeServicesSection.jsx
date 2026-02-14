import React from "react";
import {
  Lightbulb,
  Hammer,
  Droplets,
  Trash2,
  Leaf,
  ShieldAlert,
} from "lucide-react";
import ServiceCard from "./cards/ServiceCard";
import { motion } from "framer-motion";
import streetlightImg from "../../assets/images/street_light.png";
import potholeImg from "../../assets/images/pothole.png";
import sewageImg from "../../assets/images/sewage.png";
import wasteImg from "../../assets/images/waste.png";
import parkImg from "../../assets/images/park.png";
import vandalismImg from "../../assets/images/vandalism.png";

const services = [
  {
    title: "Streetlight Repairs",
    description:
      "Ensuring every corner of the city is well-lit. We manage rapid replacements of faulty LED panels, wiring issues, and solar light maintenance to keep your streets safe at night.",
    icon: Lightbulb,
    image: streetlightImg,
    color: "amber",
  },
  {
    title: "Road & Pothole Fixes",
    description:
      "Smooth roads for a smoother commute. Report road damage or dangerous potholes directly to the PWD wing for rapid asphalt filling and structural repairs.",
    icon: Hammer,
    image: potholeImg,
    color: "orange",
  },
  {
    title: "Water & Sewage",
    description:
      "Fixing leakages and ensuring clean supply. From broken main lines to clogged drainage systems, we connect you with the water board for immediate resolution.",
    icon: Droplets,
    image: sewageImg,
    color: "blue",
  },
  {
    title: "Waste Management",
    description:
      "Keeping the city clean and green. Use this service to report missed garbage collections, illegal dumping sites, or to request bulk waste pickups in your area.",
    icon: Trash2,
    image: wasteImg,
    color: "emerald",
  },
  {
    title: "Parks & Greenery",
    description:
      "Maintaining our public lungs. Report broken benches in parks, overgrown bushes, or request new tree plantation drives to improve our local ecosystem.",
    icon: Leaf,
    image: parkImg,
    color: "lime",
  },
  {
    title: "Public Vandalism",
    description:
      "Preserving our city's beauty. Report graffiti on public monuments, damaged government property, or broken fencing to ensure rapid restoration.",
    icon: ShieldAlert,
    image: vandalismImg,
    color: "rose",
  },
];

const HomeServicesSection = () => {
  return (
    <section className="py-14 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Community Issues We Handle
          </h2>
          <motion.div
            className="h-1.5 bg-emerald-500 rounded-full mx-auto mb-6 max-w-[90%] sm:max-w-md"
            initial={{ width: "1rem" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            JanSamadhan empowers you to resolve civic issues by bridging the gap
            between citizens and authorities.
          </p>
        </div>

        {/* 3 Cards per row grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection;
