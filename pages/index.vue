<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <room></room>
    </v-flex>
  </v-layout>
</template>

<script>
import Room from '~/components/Room'
export default {
  components: {
    Room
  }
}
</script>
