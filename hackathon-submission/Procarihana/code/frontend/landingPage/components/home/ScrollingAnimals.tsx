"use client";
import PetCard from "@/components/PetCard";
import { Animals } from "@/config/scrollingAnimals";
import { useTheme } from "next-themes";
import Marquee from "react-fast-marquee";

const ScrollingAnimals = () => {
  const { theme } = useTheme();
  return (
    <section className="mx-auto w-full md:max-w-5xl lg:max-w-7xl px-0 md:px-2 lg:px-2 pt-8">
      <Marquee direction="left" autoFill pauseOnHover>
        {Animals.map((item, index) => (
          <div key={index} className="mr-3">
            <PetCard name={item.name} imageUrl={item.image} desc={item.desc} city={item.city}></PetCard>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ScrollingAnimals;
