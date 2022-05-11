import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
const SwitchLang = () => {
  const { asPath, locale } = useRouter();
  const { t } = useTranslation();
  const newLocale = locale === "en" ? "es" : "en";
  return (
    <button className="uppercase">
      <Link href={asPath} locale={newLocale}>
        <a>{t(`common:langs.${newLocale}.value`)}</a>
      </Link>
    </button>
  );
};

export default SwitchLang;
