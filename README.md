# mediasoup-nuxt-example

> Life seemed very unfair with only mediasoup-react example out there.

Mediasoup demo server not included

## Installation:
1. git clone https://github.com/versatica/mediasoup-demo
2. cd mediasoup-demo/server
3. Configure config.js (pay attention to tls section - if you plan to run it localhost don`t forget to create selfsigned ssl certs first)
4. node server.js
5. Create nginx vhost (e.g. https://rtc.loc) to reverse proxy to client app port (3000), don`t forget ssl certs there too 
6. cd mediasoup-nuxt-example
7. yarn dev
8. https://rtc.loc/?roomId=my_room_name

After that demo app should work

Bug reports are welcome, unless they are related to RTC, underlying mediasoup library or mediasoup-client.
Also, just as original demo authors meant it to be, this is just a demo app, not production ready at all, you are always welcome to read manual (https://mediasoup.org/documentation/) and create something of your own :)

## Disclaimer
I definitely forgot to port some features and left some bugs, but besides **facial recognition** it seems to work ok

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
