<template>
  <div>
    <div class="indicators">
      <div v-if="!audioEnabled" class="icon mic-off" />

      <div v-if="!videoConsumer" class="icon webcam-off" />
    </div>

    <peer-view
      :peer="peer"
      :audio-consumer-id="audioConsumer ? audioConsumer.id : null"
      :video-consumer-id="videoConsumer ? videoConsumer.id : null"
      :audio-rtp-parameters="audioConsumer ? audioConsumer.rtpParameters : null"
      :video-rtp-parameters="videoConsumer ? videoConsumer.rtpParameters : null"
      :consumer-spatial-layers="
        videoConsumer ? videoConsumer.spatialLayers : null
      "
      :consumer-temporal-layers="
        videoConsumer ? videoConsumer.temporalLayers : null
      "
      :consumer-current-spatial-layer="
        videoConsumer ? videoConsumer.currentSpatialLayer : null
      "
      :consumer-current-temporal-layer="
        videoConsumer ? videoConsumer.currentTemporalLayer : null
      "
      :consumer-preferred-spatial-layer="
        videoConsumer ? videoConsumer.preferredSpatialLayer : null
      "
      :consumer-preferred-temporal-layer="
        videoConsumer ? videoConsumer.preferredTemporalLayer : null
      "
      :consumer-priority="videoConsumer ? videoConsumer.priority : null"
      :audio-track="audioConsumer ? audioConsumer.track : null"
      :video-track="videoConsumer ? videoConsumer.track : null"
      :audio-muted="audioMuted"
      :video-visible="videoVisible"
      :video-multi-layer="
        videoConsumer !== undefined &&
          videoConsumer &&
          videoConsumer.type !== 'simple'
      "
      :audio-codec="audioConsumer ? audioConsumer.codec : null"
      :video-codec="videoConsumer ? videoConsumer.codec : null"
      :audio-score="audioConsumer ? audioConsumer.score : null"
      :video-score="videoConsumer ? videoConsumer.score : null"
      :face-detection="faceDetection"
      @onChangeVideoPreferredLayers="onChangeVideoPreferredLayers"
      @onChangeMaxSendingSpatialLayer="onChangeMaxSendingSpatialLayer"
      @onChangeVideoPriority="onChangeVideoPriority"
      @onRequestKeyFrame="onRequestKeyFrame"
      @onStatsClick="onSetStatsPeerId"
    />
  </div>
</template>

<script>
import PeerView from '~/components/PeerView/PeerView'
export default {
  components: { PeerView },
  props: {
    peer: {
      type: Object,
      required: true
    },
    roomClient: {
      type: Object,
      required: true
    }
  },
  computed: {
    audioConsumer() {
      const consumersArray = this.peer.consumers.map((consumerId) =>
        this.$store.state.consumers.consumers.find(
          (consumer) => consumer.id === consumerId
        )
      )

      return consumersArray
        .filter((consumer) => !!consumer)
        .find((consumer) => consumer.track.kind === 'audio')
    },
    audioEnabled() {
      return (
        Boolean(this.audioConsumer) &&
        !this.audioConsumer.locallyPaused &&
        !this.audioConsumer.remotelyPaused
      )
    },
    videoVisible() {
      return (
        Boolean(this.videoConsumer) &&
        !this.videoConsumer.locallyPaused &&
        !this.videoConsumer.remotelyPaused
      )
    },
    videoConsumer() {
      const consumersArray = this.peer.consumers.map((consumerId) =>
        this.$store.state.consumers.consumers.find(
          (consumer) => consumer.id === consumerId
        )
      )

      return consumersArray
        .filter((consumer) => !!consumer)
        .find((consumer) => consumer.track.kind === 'video')
    },
    audioMuted() {
      return this.$store.state.me.audioMuted
    },
    faceDetection() {
      return this.$store.state.room.faceDetection
    }
  },
  methods: {
    onRequestKeyFrame() {
      this.roomClient.requestConsumerKeyFrame(this.videoConsumer.id)
    },
    onChangeVideoPreferredLayers(
      newPreferredSpatialLayer,
      newPreferredTemporalLayer
    ) {
      this.roomClient.setConsumerPreferredLayers(
        this.videoConsumer.id,
        newPreferredSpatialLayer,
        newPreferredTemporalLayer
      )
    },
    onChangeMaxSendingSpatialLayer(newMaxSpatialLayer) {
      this.roomClient.setConsumerPreferredLayers(
        this.videoConsumer.id,
        newMaxSpatialLayer,
        this.roomClient.temporalLayer
      )
    },
    onChangeVideoPriority(priority) {
      this.roomClient.setConsumerPriority(this.videoConsumer.id, priority)
    },
    onSetStatsPeerId(peerId) {
      this.$store.commit('room/setRoomStatsPeerId', peerId)
    }
  }
}
</script>
