<template>
  <nuxt />
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>

<script>
import * as cookiesManager from '~/utils/cookiesManager'

export default {
  mounted() {
    if (!cookiesManager.getDevices()) {
      cookiesManager.setDevices({ webcamEnabled: true })
    }
  }
}
</script>
