// import CTA from "@/components/home/CTA";
import FAQ from "@/components/home/FAQ";
// import Feature from "@/components/home/Feature";
// import Hero from "@/components/home/Hero";
import Hero from "@/components/home/HeroAdopt";
// import Pricing from "@/components/home/Pricing";
// import ScrollingLogos from "@/components/home/ScrollingLogos";
import ScrollingLogos from "@/components/home/ScrollingAnimals";
import SocialProof from "@/components/home/SocialProof";
// import Testimonials from "@/components/home/Testimonials";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import Steper from '@/components/home/Stepper'

export const dynamic = "force-dynamic";

export default async function HomeIndex({ lang }: { lang: string }) {
  const langName = lang || defaultLocale;
  const dict = await getDictionary(langName);

  return (
    <>
      {/* Hero Section */}
      <Hero locale={dict.Hero} CTALocale={dict.CTAButton} lang={langName}/>
      <SocialProof locale={dict.SocialProof} />
      {/* display technology stack, partners, project honors, etc. */}
      <ScrollingLogos />

      {/* Showcase */}
      {/* <Showcase id="Showcase" locale={dict.Showcase} /> */}

      {/* USP (Unique Selling Proposition) */}
      {/* <Feature id="Features" locale={dict.Feature} langName={langName} /> */}
      <div className="pt-5"></div>
      <Steper id="steps" locale={dict.Steps} lang={langName}></Steper>
      <div className="pt-5"></div>
      {/* Pricing */}
      {/* <Pricing id="Pricing" locale={dict.Pricing} langName={langName} /> */}

      {/* Testimonials */}
      {/* <Testimonials id="Testimonials" locale={dict.Testimonials} /> */}

      {/* FAQ (Frequently Asked Questions) */}
      <FAQ id="FAQ" locale={dict.FAQ} langName={langName} />

      {/* CTA (Call to Action) */}
      {/* <CTA locale={dict.CTA} CTALocale={dict.CTAButton} /> */}
    </>
  );
}
