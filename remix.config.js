import { flatRoutes } from 'remix-flat-routes'

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  tailwind: true,
  postcss: true,
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  serverPlatform: 'node',
  browserNodeBuiltinsPolyfill: {
    modules: {
      path: true,
      os: true,
      crypto: true,
      util: true,
      events: true,
      http2: true,
      zlib: true,
      process: true,
      assert: true,
      http: true,
      buffer: true,
      stream: true,
      tls: true,
      net: true,
      url: true,
      https: true,
      querystring: true,
      fs: true,
      child_process: true,
    },
  },
  routes: defineRoutes => {
    return flatRoutes(['routes'], defineRoutes)
  },
}
