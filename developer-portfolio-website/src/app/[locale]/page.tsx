import SolarSystemScene from "../components/SolarSystemScene";
import { NextIntlClientProvider } from 'next-intl';

export default function Home() {
  return  <NextIntlClientProvider><SolarSystemScene /></NextIntlClientProvider>;
}
