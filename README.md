# mediasoup-nuxt-example
> WIP
> Life seemed very unfair with only mediasoup-react example out there.

Mediasoup demo server not included, first you have to:
1. git clone https://github.com/versatica/mediasoup-demo
2. cd mediasoup-demo/server
3. Configure config.js (pay attention to tls section - if you plan to run it localhost don`t forget to create selfsigned ssl certs first)
4. node server.js
5. Create nginx vhost to reverse proxy to client app port (3000), dont forget ssl certs there too 
6. cd mediasoup-nuxt-example
7. yarn dev
8. https://{client-vhost}/?roomId=my_room_name

After that demo app should work

Related questions are very much welcome

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
