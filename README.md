# Nextjs App router workshop

A Quick run through on how to migrate a client side app, first to use server side rendering, then incremental static regeneration, and finally, migrate to use server components.

## Prerequisites

Before the workshop, ensure that you have [nvm](https://github.com/nvm-sh/nvm) (or [fnm](https://github.com/Schniz/fnm)) is installed.

Optionally, if you want to deploy your application, set up a Vercel account:

1. https://vercel.com/signup
1. Select "Hobby"
1. Enter your name and press continue
1. Continue with GitHub

## Getting started

1. Select the right node version (or install it)

   ```bash
   nvm use
   ```

1. Install the correct version of pnpm

   ```bash
   corepack enable
   ```

1. Install dependencies

   ```bash
   pnpm install
   ```

1. Run app

   ```bash
   pnpm dev
   ```

## Tasks

### Implement server side rendering

This can be implemented one of 2 ways
Hydrated tanstack query state: https://tanstack.com/query/latest/docs/framework/react/examples/nextjs
Page props: https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props

### Implement static pages with ISR

This is where some tricky page invalidation will need to occur (Perhaps you will need to add some revalidation calls to the api)
https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration

### Migrate to server components

- Migrate layout to app
- Migrate pages to app
- Load data in server components

## Stretch goals

### Implement a loading page

https://nextjs.org/docs/app/api-reference/file-conventions/loading

### Migrate mutation apis to server actions

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
