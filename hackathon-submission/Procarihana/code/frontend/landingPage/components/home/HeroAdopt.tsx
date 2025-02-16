"use client";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
// import TypingAnimation from "@/components/ui/typing-animation";
import CTAButton from "@/components/home/CTAButton";

const Hero = ({ locale, CTALocale, lang }: { locale: any; CTALocale: any; lang: string }) => {
  const words = locale.titleEnd.split('').map((item: string, index: number) => {
    return {
      text: item,
      className: 'text-3xl md:text-6xl lg:text-6xl sm:text-6xl'
    }
  });
  words.unshift(...locale.titleLove.split('').map((item: string) => {
    return {
      text: item,
      className: 'text-3xl md:text-6xl lg:text-6xl sm:text-6xl text-[hsl(var(--primary))]'
    }
  }));
  return (
    <>
      <section className="grid lg:grid-cols-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-16 md:pt-4 text-center">
        <div
          style={{
            width: "500px",
            height: "260px",
            backgroundImage: `url(https://pub-d4862abababb476e8724da7f0b64c5c1.r2.dev/petpet-hero-bg.png)`,
            backgroundSize: "cover",
            backgroundPosition: "right",
            backgroundRepeat: "no-repeat",
          }}
          className="md:order-1 hidden md:block"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-start relative flex items-center text-3xl md:text-6xl lg:text-6xl sm:text-6xl">
            {/* <span className="text-[hsl(var(--primary))] mr-3">{locale.titleLove}</span> */}
            {/* <TypingAnimation className="text-6xl" as={"span"} startOnView={true}>{locale.titleEnd}</TypingAnimation> */}
            <TypewriterEffect words={words} cursorClassName="md:h-14 lg:h-14 sm:h-14 h-7 bg-black md:-mb-2 sm:-mb-2 lg:-mb-2 -mb-1" />
            {/* {locale.title1} <LineText>{locale.title2}</LineText> {locale.title3} */}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl md:text-3xl lg:text-3xl sm:text-3xl tracking-tight text-slate-700 dark:text-slate-400 text-start relative">
            {/* {siteConfig.description} */}
            {locale.description}
          </p>
          <div className="mt-10">
            <CTAButton locale={CTALocale} lang={lang}></CTAButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
