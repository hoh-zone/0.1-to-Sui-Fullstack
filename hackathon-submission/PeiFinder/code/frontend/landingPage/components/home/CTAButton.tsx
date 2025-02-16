import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";
import Link from "next/link";

const CTAButton = ({ locale, lang }: { locale: any, lang: string }) => {
  return (
    <Link
      href={`/${lang === "en" ? "" : lang}#steps`}
      rel="noopener noreferrer nofollow"
    >
      <Button
        variant="default"
        className="flex items-center gap-2 text-white"
        aria-label="Get Boilerplate"
      >
        <Workflow />
        {locale.title}
      </Button>
    </Link>
  );
};

export default CTAButton;
