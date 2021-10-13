# build
FROM node:14 as build

WORKDIR /usr/src/app/

# install project dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# build project
COPY src ./src
COPY public ./public
COPY tsconfig.json .eslintrc.js babel.config.js ./
RUN yarn run build

# use build only
FROM node:14 as runtime

RUN npm i -g serve

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist

CMD serve -s /usr/src/app/dist