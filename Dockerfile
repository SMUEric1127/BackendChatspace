###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

USER node

###################
# BUILD FOR PRODUCTION
###################
FROM node:16 As build

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM node:16 As production

COPY  --from=build /usr/src/app/node_modules ./node_modules
COPY  --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
