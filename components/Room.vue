<template>
  <transition appear>
    <div data-component="Room">
      <Notifications />

      <div class="state">
        <div class="icon" :class="room.state" />
        <p class="text" :class="room.state">{{ room.state }}</p>
      </div>

      <div class="room-link-wrapper">
        <div class="room-link">
          <a
            class="link"
            :href="room.url"
            target="_blank"
            rel="noopener noreferrer"
            @click="onInvitationLinkClick"
          >
            invitation link
          </a>
        </div>
      </div>

      <Peers v-if="roomClientReady" :room-client="roomClient" />

      <div class="me-container" :class="{ 'active-speaker': amActiveSpeaker }">
        <Me v-if="roomClientReady" :room-client="roomClient" />
      </div>

      <div class="chat-input-container">
        <ChatInput v-if="roomClientReady" :room-client="roomClient" />
      </div>

      <div class="sidebar">
        <div
          class="button hide-videos"
          :class="{
            on: me.audioOnly,
            disabled: me.audioOnlyInProgress
          }"
          title="Show/hide participants video"
          @click="toggleParticipantsVideo"
        />

        <div
          class="button mute-audio"
          :class="{ on: me.audioMuted }"
          title="Mute/unmute participants audio"
          @click="toggleMute"
        />

        <div
          class="button restart-ice"
          :class="{
            disabled: me.restartIceInProgress
          }"
          title="Restart ICE"
          @click="roomClient.restartIce()"
        />
      </div>

      <Stats />

      <NetworkThrottle
        v-if="NETWORK_THROTTLE_SECRET"
        :secret="NETWORK_THROTTLE_SECRET"
      />
    </div>
  </transition>
</template>
<script>
import clipboardCopy from 'clipboard-copy'

import UrlParse from 'url-parse'
import Notifications from '~/components/Notifications'
import NetworkThrottle from '~/components/NetworkThrottle'
import Stats from '~/components/Stats'
import ChatInput from '~/components/ChatInput'
import Me from '~/components/Me'
import Peers from '~/components/Peers'
import RoomClient from '~/utils/RoomClient'
import * as cookiesManager from '~/utils/cookiesManager'
import deviceInfo from '~/utils/deviceInfo'

import randomString from '~/utils/randomString'
import randomName from '~/utils/randomName'

export default {
  components: { Notifications, NetworkThrottle, Stats, ChatInput, Me, Peers },
  data() {
    return {
      roomClient: null,
      roomClientReady: false,

      NETWORK_THROTTLE_SECRET: window.NETWORK_THROTTLE_SECRET
    }
  },
  computed: {
    me() {
      return this.$store.state.me
    },
    amActiveSpeaker() {
      return this.$store.state.me.id === this.$store.state.room.activeSpeakerId
    },
    room() {
      return this.$store.state.room
    }
  },
  mounted() {
    const urlParser = new UrlParse(window.location.href, true)
    const peerId = randomString(8).toLowerCase()

    let roomId = urlParser.query.roomId
    let displayName =
      urlParser.query.displayName ||
      (cookiesManager.getUser() || {}).displayName
    const handler = urlParser.query.handler
    const useSimulcast = urlParser.query.simulcast !== 'false'
    const useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false'
    const forceTcp = urlParser.query.forceTcp === 'true'
    const produce = urlParser.query.produce !== 'false'
    const consume = urlParser.query.consume !== 'false'
    const forceH264 = urlParser.query.forceH264 === 'true'
    const forceVP9 = urlParser.query.forceVP9 === 'true'
    const svc = urlParser.query.svc
    const datachannel = urlParser.query.datachannel !== 'false'
    const info = urlParser.query.info === 'true'
    const faceDetection = urlParser.query.faceDetection === 'true'
    const externalVideo = urlParser.query.externalVideo === 'true'
    const throttleSecret = urlParser.query.throttleSecret

    /*
    // Enable face detection on demand.
    if (faceDetection) {
      await faceapi.loadTinyFaceDetectorModel('/resources/face-detector-models');
    }
    */

    if (info) {
      // eslint-disable-next-line require-atomic-updates
      window.SHOW_INFO = true
    }

    if (throttleSecret) {
      // eslint-disable-next-line require-atomic-updates
      window.NETWORK_THROTTLE_SECRET = throttleSecret
    }

    if (!roomId) {
      roomId = randomString({ length: 8 }).toLowerCase()

      urlParser.query.roomId = roomId
      window.history.pushState('', '', urlParser.toString())
    }

    // Get the effective/shareable Room URL.
    const roomUrlParser = new UrlParse(window.location.href, true)

    delete roomUrlParser.hash

    const roomUrl = roomUrlParser.toString()

    let displayNameSet

    // If displayName was provided via URL or Cookie, we are done.
    if (displayName) {
      displayNameSet = true
    }
    // Otherwise pick a random name and mark as "not set".
    else {
      displayNameSet = false
      displayName = randomName()
    }

    // Get current device info.
    const device = deviceInfo()

    this.$store.commit('room/setRoomUrl', { roomUrl })

    this.$store.commit('room/setFaceDetection', { flag: faceDetection })

    this.$store.commit('me/setMe', {
      me: { peerId, displayName, displayNameSet, device }
    })

    this.roomClient = new RoomClient({
      roomId,
      peerId,
      displayName,
      device,
      handlerName: handler,
      useSimulcast,
      useSharingSimulcast,
      forceTcp,
      produce,
      consume,
      forceH264,
      forceVP9,
      svc,
      datachannel,
      externalVideo,

      store: this.$store
    })

    this.roomClient.join()

    this.roomClientReady = true
  },
  methods: {
    toggleParticipantsVideo() {
      this.me.audioOnly
        ? this.roomClient.disableAudioOnly()
        : this.roomClient.enableAudioOnly()
    },

    toggleMute() {
      this.me.audioMuted
        ? this.roomClient.unmuteAudio()
        : this.roomClient.muteAudio()
    },
    onInvitationLinkClick(event) {
      // If this is a 'Open in new window/tab' don't prevent
      // click default action.
      if (
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey ||
        // Middle click (IE > 9 and everyone else).
        (event.button && event.button === 1)
      ) {
        return
      }

      event.preventDefault()

      clipboardCopy(this.room.url).then(
        this.$store.dispatch('notify', {
          text: 'Room link copied to the clipboard'
        })
      )
    }
  }
}
</script>
