// import { Makers } from "@/config/makers";
import { Animals } from "@/config/scrollingAnimals";
import Image from "next/image";

const SocialProof = ({ locale }: { locale: any }) => {
  return (
    <section className="flex flex-col items-center justify-center gap-20 pt-8">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center justify-center">
          {Animals.slice(0, 5).map((item, index) => {
            return (
              // <Image
              //   key={index}
              //   src={item.image}
              //   alt="User"
              //   height={40}
              //   width={40}
              //   // fill
              //   className="rounded-full -m-[5px] border border-white h-[40px]"
              // />
              <div
                className="h-[40px] w-[40px] rounded-full border border-white -m-[5px] relative"
                key={index}
              >
                <Image
                  src={item.image}
                  alt={`${item.name}`}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            );
          })}
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-400">
          <span className="text-primary font-semibold text-base text-lg">
            750
          </span>{" "}
          {locale.maker}
        </p>
      </div>
    </section>
  );
};

export default SocialProof;

