import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* ✅ Your Custom Metadata */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#059669" />
        <meta name="description" content="GloriousTwins Radio - Live from Ibadan. Uplifting music, inspiring voices, and unforgettable moments." />
        
        {/* ✅ Facebook/OpenGraph */}
        <meta property="og:title" content="GloriousTwins Radio" />
        <meta property="og:description" content="Live radio streaming from Ibadan, Nigeria" />
        <meta property="og:image" content="/presenters/logo.jpg" />
        <meta property="og:url" content="https://glorioustwinsradio.com.ng" />
        <meta property="og:type" content="website" />
        
        {/* ✅ Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GloriousTwins Radio" />
        <meta name="twitter:description" content="Live radio streaming from Ibadan, Nigeria" />
        <meta name="twitter:image" content="/presenters/logo.jpg" />
        
        {/* ✅ Favicon */}
        <link rel="icon" href="/presenters/logo.jpg" />
        <link rel="apple-touch-icon" href="/presenters/logo.jpg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}