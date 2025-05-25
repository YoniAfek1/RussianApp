import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/@xenova/transformers@3/dist/transformers.min.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 