# build
FROM node:14 as build

WORKDIR /usr/src/app/

ENV CI=true

# install project dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# build project
COPY src ./src
COPY tsconfig.json ./
RUN yarn run build

CMD yarn run serve

# use build only
FROM node:14 as runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist

CMD node /usr/src/app/dist/main.js