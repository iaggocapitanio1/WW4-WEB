/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['127.0.0.1', 'localhost', 'cdn.pixabay.com', 'as1.ftcdn.net', 'flagcdn.com'],
  },
  reactStrictMode: true,
  // i18n: {
  //   // These are all the locales you want to support in
  //   // your application
  //   locales: ['en', 'pt'],
  //   // This is the default locale you want to be used when visiting
  //   // a non-locale prefixed path e.g. `/hello`
  //   defaultLocale: 'en',
  //   // This is a list of locale domains and the default locale they
  //   // should handle (these are only required when setting up domain routing)
  //   // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
  //   domains: [
  //     {
  //       domain: 'example.com',
  //       defaultLocale: 'en',
  //       http: true,

  //     },
  //     {
  //       domain: 'example.pt',
  //       defaultLocale: 'pt',
  //       http: true,
  //     },
  //   ],
  // },
};

module.exports = nextConfig;
