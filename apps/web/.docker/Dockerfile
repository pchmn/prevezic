# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME="/pnpm"
ENV TURBO_CACHE_DIR="/.turbo"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable
RUN pnpm config set store-dir ${PNPM_HOME}

FROM base AS build
WORKDIR /app
COPY . /app/
RUN --mount=type=cache,target=${PNPM_HOME} \
    pnpm install --frozen-lockfile
RUN --mount=type=cache,target=${TURBO_CACHE_DIR} \
    pnpm turbo build --filter=@prevezic/web

FROM nginx:alpine AS production
WORKDIR /app
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/.docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/web/.docker/envsubset.sh /usr/local/bin/envsubset.sh
COPY apps/web/.docker/healthcheck.sh /usr/local/bin/healthcheck.sh
EXPOSE 80
# Run the envsubset script and then start the app
CMD ["sh", "-c", "/usr/local/bin/envsubset.sh && nginx -g 'daemon off;'"]
# HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
#   CMD /usr/local/bin/healthcheck.sh
