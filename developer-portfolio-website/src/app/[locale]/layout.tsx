import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';

type LocaleParams = { locale: string };

export default async function LocaleLayout(
  props: { children: React.ReactNode; params: Promise<LocaleParams> }
): Promise<React.ReactNode> {
  const { children, params } = props;
  const { locale } = await params;   

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}