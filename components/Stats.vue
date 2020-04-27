<template>
  <div data-component="Stats">
    <div class="content" :class="{ visible: peerId && peerId.length > 0 }">
      <div class="header">
        <div class="info">
          <div class="close-icon" @click="onClose" />
          <v-icon @click="_start">mdi-refresh</v-icon>
          <div v-if="isMe">
            <h1>Your Stats</h1>
          </div>

          <div v-else>
            <h1>Stats of {{ peerDisplayName }}</h1>
          </div>
        </div>

        <div class="list">
          <div v-if="sendTransportRemoteStats || sendTransportLocalStats">
            <p>
              send transport stats:
              <a href="#send-transport-remote-stats">[remote]</a>
              <span> </span>
              <a href="#send-transport-local-stats">[local]</a>
            </p>
          </div>

          <div v-if="recvTransportRemoteStats || recvTransportLocalStats">
            <p>
              recv transport stats:
              <a href="#recv-transport-remote-stats">[remote]</a>
              <span> </span>
              <a href="#recv-transport-local-stats">[local]</a>
            </p>
          </div>

          <div v-if="audioProducerRemoteStats || audioProducerLocalStats">
            <p>
              audio producer stats:
              <a href="#audio-producer-remote-stats">[remote]</a>
              <span> </span>
              <a href="#audio-producer-local-stats">[local]</a>
            </p>
          </div>

          <div v-if="videoProducerRemoteStats || videoProducerLocalStats">
            <p>
              video producer stats:
              <a href="#video-producer-remote-stats">[remote]</a>
              <span> </span>
              <a href="#video-producer-local-stats">[local]</a>
            </p>
          </div>

          <div v-if="chatDataProducerRemoteStats">
            <p>
              chat dataproducer stats:
              <a href="#chat-dataproducer-remote-stats">[remote]</a>
              <span> </span>
              <a class="disabled">[local]</a>
            </p>
          </div>

          <div v-if="botDataProducerRemoteStats">
            <p>
              bot dataproducer stats:
              <a href="#bot-dataproducer-remote-stats">[remote]</a>
              <span> </span>
              <a class="disabled">[local]</a>
            </p>
          </div>

          <div v-if="audioConsumerRemoteStats || audioConsumerLocalStats">
            <p>
              audio consumer stats:
              <a href="#audio-consumer-remote-stats">[remote]</a>
              <span> </span>
              <a href="#audio-consumer-local-stats">[local]</a>
            </p>
          </div>

          <div v-if="videoConsumerRemoteStats || videoConsumerLocalStats">
            <p>
              video consumer stats:
              <a href="#video-consumer-remote-stats">[remote]</a>
              <span> </span>
              <a href="#video-consumer-local-stats">[local]</a>
            </p>
          </div>

          <div v-if="chatDataConsumerRemoteStats">
            <p>
              chat dataconsumer stats:
              <a href="#chat-dataconsumer-remote-stats">[remote]</a>
              <span> </span>
              <a class="disabled">[local]</a>
            </p>
          </div>

          <div v-if="botDataConsumerRemoteStats">
            <p>
              bot dataconsumer stats:
              <a href="#bot-dataconsumer-remote-stats">[remote]</a>
              <span> </span>
              <a class="disabled">[local]</a>
            </p>
          </div>
        </div>
      </div>

      <div class="stats">
        <div v-if="sendTransportRemoteStats">
          <print-stats
            title="send transport remote stats"
            :stats="sendTransportRemoteStats"
          ></print-stats>
        </div>

        <div v-if="sendTransportLocalStats">
          <print-stats
            title="send transport local stats"
            :stats="sendTransportLocalStats"
          />
        </div>

        <div v-if="recvTransportRemoteStats">
          <print-stats
            title="recv transport remote stats"
            :stats="recvTransportRemoteStats"
          />
        </div>

        <div v-if="recvTransportLocalStats">
          <print-stats
            title="recv transport local stats"
            :stats="recvTransportLocalStats"
          />
        </div>

        <div v-if="audioProducerRemoteStats">
          <print-stats
            title="audio producer remote stats"
            :stats="audioProducerRemoteStats"
          />
        </div>

        <div v-if="audioProducerLocalStats">
          <print-stats
            title="audio producer local stats"
            :stats="audioProducerLocalStats"
          />
        </div>

        <div v-if="videoProducerRemoteStats">
          <print-stats
            title="video producer remote stats"
            :stats="videoProducerRemoteStats"
          />
        </div>

        <div v-if="videoProducerLocalStats">
          <print-stats
            title="video producer local stats"
            :stats="videoProducerLocalStats"
          />
        </div>

        <div v-if="chatDataProducerRemoteStats">
          <print-stats
            title="chat dataproducer remote stats"
            :stats="chatDataProducerRemoteStats"
          />
        </div>

        <div v-if="botDataProducerRemoteStats">
          <print-stats
            title="bot dataproducer remote stats"
            :stats="botDataProducerRemoteStats"
          />
        </div>

        <div v-if="audioConsumerRemoteStats">
          <print-stats
            title="audio consumer remote stats"
            :stats="audioConsumerRemoteStats"
          />
        </div>

        <div v-if="audioConsumerLocalStats">
          <print-stats
            title="audio consumer local stats"
            :stats="audioConsumerLocalStats"
          />
        </div>

        <div v-if="videoConsumerRemoteStats">
          <print-stats
            title="video consumer remote stats"
            :stats="videoConsumerRemoteStats"
          />
        </div>

        <div v-if="videoConsumerLocalStats">
          <print-stats
            title="video consumer local stats"
            :stats="videoConsumerLocalStats"
          />
        </div>

        <div v-if="chatDataConsumerRemoteStats">
          <print-stats
            title="chat dataconsumer remote stats"
            :stats="chatDataConsumerRemoteStats"
          ></print-stats>
        </div>

        <div v-if="botDataConsumerRemoteStats">
          <print-stats
            title="bot dataconsumer remote stats"
            :stats="botDataConsumerRemoteStats"
          ></print-stats>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PrintStats from '~/components/PrintStats'

export default {
  components: { PrintStats },
  props: {
    roomClient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      sendTransportRemoteStats: null,
      sendTransportLocalStats: null,
      recvTransportRemoteStats: null,
      recvTransportLocalStats: null,
      audioProducerRemoteStats: null,
      audioProducerLocalStats: null,
      videoProducerRemoteStats: null,
      videoProducerLocalStats: null,
      chatDataProducerRemoteStats: null,
      botDataProducerRemoteStats: null,
      audioConsumerRemoteStats: null,
      audioConsumerLocalStats: null,
      videoConsumerRemoteStats: null,
      videoConsumerLocalStats: null,
      chatDataConsumerRemoteStats: null,
      botDataConsumerRemoteStats: null,

      delayTimer: null
    }
  },
  computed: {
    peers() {
      return this.$store.state.peers.peers
    },
    room() {
      return this.$store.state.room
    },
    me() {
      return this.$store.state.me
    },
    isMe() {
      return this.me.id === this.room.statsPeerId
    },
    peer() {
      return this.isMe
        ? this.me
        : this.peers.find((peer) => peer.id === this.room.statsPeerId)
    },
    peerId() {
      return this.peer ? this.peer.id : ''
    },
    peerDisplayName() {
      return this.peer ? this.peer.displayName : ''
    },
    consumers() {
      return this.$store.state.consumers.consumers
    },
    dataConsumers() {
      return this.$store.state.dataConsumers.dataConsumers
    },
    audioConsumerId() {
      if (this.isMe || !this.peer) {
        return ''
      }

      for (const consumerId of this.peer.consumers) {
        const consumer = this.consumers.find(
          (consumer) => consumer.id === consumerId
        )

        if (consumer.track.kind === 'audio') {
          return consumer.id
        }
      }

      return ''
    },
    videoConsumerId() {
      if (this.isMe || !this.peer) {
        return ''
      }
      for (const consumerId of this.peer.consumers) {
        const consumer = this.consumers.find(
          (consumer) => consumer.id === consumerId
        )

        if (consumer.track.kind === 'video') {
          return consumer.id
        }
      }

      return ''
    },
    chatDataConsumerId() {
      if (this.isMe || !this.peer) {
        return ''
      }
      for (const dataConsumerId of this.peer.dataConsumers) {
        const dataConsumer = dataConsumerId.find(
          (dataConsumer) => dataConsumer.id === dataConsumerId
        )

        if (dataConsumer.label === 'bot') {
          return dataConsumer.id
        }
      }

      return ''
    },
    botDataConsumerId() {
      for (const dataConsumer of this.dataConsumers) {
        if (dataConsumer.label === 'bot') {
          return dataConsumer.id
        }
      }

      return ''
    }
  },
  mounted() {
    this._start()
  },
  methods: {
    onClose() {
      this.$store.commit('room/setRoomStatsPeerId', { peerId: null })
    },
    _stop() {
      clearTimeout(this.delayTimer)

      this.sendTransportRemoteStats = null
      this.sendTransportLocalStats = null
      this.recvTransportRemoteStats = null
      this.recvTransportLocalStats = null
      this.audioProducerRemoteStats = null
      this.audioProducerLocalStats = null
      this.videoProducerRemoteStats = null
      this.videoProducerLocalStats = null
      this.chatDataProducerRemoteStats = null
      this.botDataProducerRemoteStats = null
      this.audioConsumerRemoteStats = null
      this.audioConsumerLocalStats = null
      this.videoConsumerRemoteStats = null
      this.videoConsumerLocalStats = null
      this.chatDataConsumerRemoteStats = null
      this.botDataConsumerRemoteStats = null
    },
    async _start() {
      this.sendTransportRemoteStats = null
      this.sendTransportLocalStats = null
      this.recvTransportRemoteStats = null
      this.recvTransportLocalStats = null
      this.audioProducerRemoteStats = null
      this.audioProducerLocalStats = null
      this.videoProducerRemoteStats = null
      this.videoProducerLocalStats = null
      this.chatDataProducerRemoteStats = null
      this.botDataProducerRemoteStats = null
      this.audioConsumerRemoteStats = null
      this.audioConsumerLocalStats = null
      this.videoConsumerRemoteStats = null
      this.videoConsumerLocalStats = null
      this.chatDataConsumerRemoteStats = null
      this.botDataConsumerRemoteStats = null

      try {
        if (this.isMe) {
          this.sendTransportRemoteStats = await this.roomClient.getSendTransportRemoteStats()

          this.sendTransportLocalStats = await this.roomClient.getSendTransportLocalStats()

          this.recvTransportRemoteStats = await this.roomClient.getRecvTransportRemoteStats()

          this.recvTransportLocalStats = await this.roomClient.getRecvTransportLocalStats()

          this.audioProducerRemoteStats = await this.roomClient.getAudioRemoteStats()

          this.audioProducerLocalStats = await this.roomClient.getAudioLocalStats()

          this.videoProducerRemoteStats = await this.roomClient.getVideoRemoteStats()

          this.videoProducerLocalStats = await this.roomClient.getVideoLocalStats()

          this.chatDataProducerRemoteStats = await this.roomClient.getChatDataProducerRemoteStats()

          this.botDataProducerRemoteStats = await this.roomClient.getBotDataProducerRemoteStats()

          this.botDataConsumerRemoteStats = await this.roomClient.getDataConsumerRemoteStats(
            this.botDataConsumerId
          )
        } else {
          this.audioConsumerRemoteStats = await this.roomClient.getConsumerRemoteStats(
            this.audioConsumerId
          )

          this.audioConsumerLocalStats = await this.roomClient.getConsumerLocalStats(
            this.audioConsumerId
          )

          this.videoConsumerRemoteStats = await this.roomClient.getConsumerRemoteStats(
            this.videoConsumerId
          )

          this.videoConsumerLocalStats = await this.roomClient.getConsumerLocalStats(
            this.videoConsumerId
          )

          this.chatDataConsumerRemoteStats = await this.roomClient.getDataConsumerRemoteStats(
            this.chatDataConsumerId
          )
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
