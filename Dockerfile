FROM node:15.14.0 AS base

WORKDIR /app

# Scripts used in the npm preinstall hook
COPY scripts/engines-check.js scripts/semver.js scripts/

# Adding our dependencies and install before adding the rest of the files
# This prevents reinstallation of npm packages for every subsequent code modification
ENV npm_config_update_notifier=false
COPY package.json package-lock.json ./
RUN npm ci --loglevel=error --no-audit --no-fund && npm rebuild node-sass

# Adding all the remaining source files
COPY . .

# We need more than the default 512MB otherwise webpack will throw 'heap out of memory' exceptions
# https://nodejs.org/api/cli.html#cli_max_old_space_size_size_in_megabytes
ENV NODE_OPTIONS=--max-old-space-size=1536

FROM base AS dev
# This is the main development build using the file watcher if you mount volumes
USER node
EXPOSE 8000
CMD npm run start:container

FROM base AS prod-dist
# We'll simply build the production dist files here to later reuse in a simple webserver
RUN npm run build

FROM nginx:1.20.0-alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=prod-dist /app/dist ./dist
COPY --from=prod-dist /app/index.html /app/favicon.ico /app/license.txt ./
EXPOSE 80
