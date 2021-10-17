# build
FROM node:14 as build

WORKDIR /usr/src/app/

# install project dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# build project
COPY internals ./internals
COPY public ./public
COPY src ./src
COPY tsconfig.json .eslintrc.js .prettierrc .prettierignore .babel-plugin-macrosrc.js ./
RUN yarn run build

CMD yarn start

# use build only
FROM node:14 as runtime

RUN npm i -g serve

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./dist

CMD serve -s /usr/src/app/dist