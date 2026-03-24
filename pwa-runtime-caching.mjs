const runtimeCaching = [
  {
    urlPattern: /\/api\/.*/i,
    handler: "NetworkOnly"
  },
  {
    urlPattern: ({ sameOrigin, request }) => sameOrigin && request.mode === "navigate",
    handler: "NetworkFirst",
    options: {
      cacheName: "app-pages",
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 30
      },
      networkTimeoutSeconds: 3
    }
  },
  {
    urlPattern: /^https?.*/,
    handler: "NetworkFirst",
    options: {
      cacheName: "http-cache",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 30
      },
      networkTimeoutSeconds: 10
    }
  },
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "static-assets",
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }
    }
  }
];

export default runtimeCaching;
