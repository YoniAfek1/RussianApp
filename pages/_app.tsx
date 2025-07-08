import type { AppProps } from 'next/app';
import Navigation from '@/components/Navigation';
import '@/styles/globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
} 