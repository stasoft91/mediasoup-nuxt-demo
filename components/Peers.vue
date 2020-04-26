<template>
  <div data-component="Peers">
    <transition v-for="peer in peers" :key="peer.id" appear>
      <div
        class="peer-container"
        :class="{
          'active-speaker': peer.id === activeSpeakerId
        }"
      >
        <Peer :peer="peer" :room-client="roomClient" />
      </div>
    </transition>
  </div>
</template>

<script>
import Peer from '~/components/Peer'
export default {
  components: { Peer },
  props: {
    roomClient: {
      type: Object,
      required: true
    }
  },
  computed: {
    peers() {
      return this.$store.state.peers.peers
    },
    activeSpeakerId() {
      return this.$store.state.room.activeSpeakerId
    }
  }
}
</script>
