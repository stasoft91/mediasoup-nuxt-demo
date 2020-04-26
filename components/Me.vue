<template>
  <div ref="rootNode" data-component="Me">
    <div v-if="connected">
      <div class="controls">
        <div class="button mic" :class="micState" @click="toggleMicState" />

        <div
          class="button webcam"
          :class="{
            webcamState,
            disabled: me.webcamInProgress || me.shareInProgress
          }"
          @click="toggleWebcam"
        />

        <div
          class="button change-webcam"
          :class="{
            changeWebcamState,
            disabled: me.webcamInProgress || me.shareInProgress
          }"
          @click="roomClient.changeWebcam()"
        />

        <div
          class="button share"
          :class="{
            shareState,
            disabled: me.shareInProgress || me.webcamInProgress
          }"
          @click="toggleShare"
        />
      </div>
    </div>

    <peer-view
      :is-me="true"
      :peer="me"
      :audio-producer-id="audioProducer ? audioProducer.id : null"
      :video-producer-id="videoProducer ? videoProducer.id : null"
      :audio-rtp-parameters="audioProducer ? audioProducer.rtpParameters : null"
      :video-rtp-parameters="videoProducer ? videoProducer.rtpParameters : null"
      :audio-track="audioProducer ? audioProducer.track : null"
      :video-track="videoProducer ? videoProducer.track : null"
      :video-visible="Boolean(videoProducer) && !videoProducer.paused"
      :audio-codec="audioProducer ? audioProducer.codec : null"
      :video-codec="videoProducer ? videoProducer.codec : null"
      :audio-score="audioProducer ? audioProducer.score : null"
      :video-score="videoProducer ? videoProducer.score : null"
      :face-detection="faceDetection"
      @onChangeDisplayName="changeDisplayName"
      @onChangeMaxSendingSpatialLayer="changeMaxSendingSpatialLayer"
      @onStatsClick="setStatsPeerId"
    />
  </div>
</template>

<script>
import * as cookiesManager from '~/utils/cookiesManager'
import PeerView from '~/components/PeerView/PeerView'
export default {
  components: { PeerView },
  props: {
    roomClient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    connected() {
      return this.$store.state.room.state === 'connected'
    },
    me() {
      return this.$store.state.me
    },
    faceDetection() {
      return this.$store.state.room.faceDetection
    },
    producers() {
      return this.$store.state.producers.producers
    },
    audioProducer() {
      return this.producers.find((producer) => producer.track.kind === 'audio')
    },
    videoProducer() {
      return this.producers.find((producer) => producer.track.kind === 'video')
    },
    changeWebcamState() {
      if (
        Boolean(this.videoProducer) &&
        this.videoProducer.type !== 'share' &&
        this.me.canChangeWebcam
      ) {
        return 'on'
      } else {
        return 'unsupported'
      }
    },
    shareState() {
      if (Boolean(this.videoProducer) && this.videoProducer.type === 'share') {
        return 'on'
      } else {
        return 'off'
      }
    },
    webcamState() {
      let webcamState

      if (!this.me.canSendWebcam) {
        webcamState = 'unsupported'
      } else if (this.videoProducer && this.videoProducer.type !== 'share') {
        webcamState = 'on'
      } else {
        webcamState = 'off'
      }

      return webcamState
    },
    micState() {
      let micState

      if (!this.me.canSendMic) {
        micState = 'unsupported'
      } else if (!this.audioProducer) {
        micState = 'unsupported'
      } else if (!this.audioProducer.paused) {
        micState = 'on'
      } else {
        micState = 'off'
      }

      return micState
    }
  },
  methods: {
    changeDisplayName(name) {
      this.roomClient.changeDisplayName(name)
    },
    changeMaxSendingSpatialLayer(spatialLevel) {
      this.roomClient.setMaxSendingSpatialLayer(spatialLevel)
    },
    setStatsPeerId(peerId) {
      this.$store.commit('room/setRoomStatsPeerId', peerId)
    },
    toggleShare() {
      if (this.shareState === 'on') {
        this.roomClient.disableShare()
      } else {
        this.roomClient.enableShare()
      }
    },
    toggleWebcam() {
      if (this.webcamState === 'on') {
        cookiesManager.setDevices({ webcamEnabled: false })
        this.roomClient.disableWebcam()
      } else {
        cookiesManager.setDevices({ webcamEnabled: true })
        this.roomClient.enableWebcam()
      }
    },
    toggleMicState() {
      this.micState === 'on'
        ? this.roomClient.muteMic()
        : this.roomClient.unmuteMic()
    }
  }
}
</script>
