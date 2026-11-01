# Development image for Next.js.
#
# node_modules is a named volume in docker-compose.yml, NOT the host's directory: modules built
# on macOS are not the modules Linux needs, and mounting the host's over the image's breaks the
# container in ways that look like application bugs.
FROM node:22-slim

ENV NODE_ENV=development
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
