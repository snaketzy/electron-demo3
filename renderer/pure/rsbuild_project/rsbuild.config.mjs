// https://rsbuild.rs/zh/guide/migration/cra
// https://rsbuild.rs/zh/guide/configuration/rsbuild

import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';

console.log("环境为:" + process.env.NODE_ENV)

export default defineConfig({
  // source: {
  //   define: {
  //     "process.env.NODE_ENV": "\"development\"" // https://rsbuild.rs/zh/guide/advanced/env-vars
  //   }
  // },
  resolve:{
    alias: { // https://rsbuild.rs/zh/guide/configuration/rsbuild
      components: "./src/components",
      assets: "./src/assets",
      utils: "./src/utils"
    }
  },
  html: { // https://rsbuild.rs/zh/guide/basic/html-template.html
    template: './src/static/index.html',
  },
  plugins: [pluginReact(), pluginLess()],
  server: {
    base: "/", // https://rsbuild.rs/zh/config/server/base
    port: 9188, // https://rsbuild.rs/zh/config/server/port
    proxy: {
      "/api/*": "http://localhost:8090/$1"
    },
    printUrls({ urls }) {
      console.log("启动时间：" + new Date().toLocaleString())
      return urls.map((url) => `${url}/base/`);
    },
  },
  output: { // https://rsbuild.rs/zh/guide/basic/output-files
    distPath: { // https://rsbuild.rs/zh/config/output/dist-path
      root: process.env.NODE_ENV === "release" ? 'dist/pre' : "dist/pro", // https://rsbuild.rs/zh/guide/advanced/env-vars
      // root: 'dist/pre'
    },
    sourceMap: { // https://rsbuild.rs/zh/config/output/source-map
      js: process.env.NODE_ENV !== "production" ? "source-map" : false,
      css: process.env.NODE_ENV !== "production" ? "source-map" : false
      // js: "source-map",
      // css: "source-map"
    },
    // filenameHash: true // https://rsbuild.rs/zh/config/output/filename-hash
    // https://rsbuild.rs/zh/guide/faq/hmr
    filename: process.env.NODE_ENV !== "development" && { // https://rsbuild.rs/zh/config/output/filename
      html: '[name].html',
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css',
      svg: '[name].[contenthash:8].svg',
      font: '[name].[contenthash:8][ext]',
      image: '[name].[contenthash:8][ext]',
      media: '[name].[contenthash:8][ext]',
      assets: '[name].[contenthash:8][ext]',
    }
  },

  dev: {
    progressBar: true // https://rsbuild.rs/zh/config/dev/progress-bar
  }
});
