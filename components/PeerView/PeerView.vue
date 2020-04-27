<template>
  <div data-component="PeerView">
    <div class="info">
      <div class="icons">
        <div
          class="icon info"
          :class="{ on: showInfo }"
          @click="showInfo = !showInfo"
        />

        <div class="icon stats" @click="onStatsClick" />
      </div>

      <div class="box" :class="{ visible: showInfo }">
        <div v-if="audioProducerId || audioConsumerId">
          <h1>audio</h1>

          <div v-if="audioProducerId">
            <p>
              id:
              <span
                class="copiable"
                data-tip="Copy audio producer id to clipboard"
                @click="clipboardCopy(audioProducerId)"
              >
                {{ audioProducerId }}
              </span>
            </p>
          </div>

          <div v-if="audioConsumerId">
            <p>
              id:
              <span
                class="copiable"
                title="Copy video producer id to clipboard"
                @click="clipboardCopy(audioConsumerId)"
              >
                {{ audioConsumerId }}
              </span>
            </p>
          </div>

          <p v-if="audioCodec">codec: {{ audioCodec }}</p>

          <div v-if="audioProducerId && audioScore">
            <div>
              <p>streams:</p>
              <p v-for="(score, idx) in sortedAudioScores" :key="idx">
                <span v-if="score.rid !== undefined">
                  rid:{{ score.rid }}, ssrc:{{ score.ssrc }}, score:{{
                    score.score
                  }}
                </span>
                <span v-else>
                  ssrc:{{ score.ssrc }}, score:{{ score.score }}
                </span>
              </p>
            </div>
          </div>

          <div v-if="audioConsumerId && audioScore">
            {{ _printConsumerScore(audioConsumerId, audioScore) }}
          </div>
        </div>

        <div v-if="videoProducerId || videoConsumerId">
          <h1>video</h1>

          <div v-if="videoProducerId">
            <p>
              id:
              <span
                class="copiable"
                title="Copy audio consumer id to clipboard"
                @click="clipboardCopy(videoProducerId)"
              >
                {{ videoProducerId }}
              </span>
            </p>
          </div>

          <div v-if="videoConsumerId">
            <p>
              id:
              <span
                class="copiable"
                title="Copy video consumer id to clipboard"
                @click="clipboardCopy(videoConsumerId)"
              >
                {{ videoConsumerId }}
              </span>
            </p>
          </div>

          <p v-if="videoCodec">codec: {{ videoCodec }}</p>

          <p v-if="videoVisible && videoResolutionWidth !== null">
            resolution: {{ videoResolutionWidth }}x{{ videoResolutionHeight }}
          </p>

          <div
            v-if="
              videoVisible &&
                videoProducerId &&
                videoRtpParameters.encodings.length > 1
            "
          >
            <p>
              max spatial layer:
              {{ maxSpatialLayer > -1 ? maxSpatialLayer : 'none' }}
              <span> </span>
              <span
                :class="{ clickable: maxSpatialLayer > -1 }"
                @click="onClickDownSpatialLayer"
              >
                [ down ]
              </span>
              <span> </span>
              <span
                :class="{
                  clickable:
                    maxSpatialLayer < videoRtpParameters.encodings.length - 1
                }"
                @click="onClickUpSpatialLayer"
              >
                [ up ]
              </span>
            </p>
          </div>

          <div v-if="!isMe && videoMultiLayer">
            <p>
              current spatial-temporal layers:
              {{ consumerCurrentSpatialLayer }}
              {{ consumerCurrentTemporalLayer }}
            </p>
            <p>
              preferred spatial-temporal layers:
              {{ consumerPreferredSpatialLayer }}
              {{ consumerPreferredTemporalLayer }}
              <span> </span>
              <span class="clickable" @click="onClickDownVideoPreferredLayers">
                [ down ]
              </span>
              <span> </span>
              <span class="clickable" @click="onClickUpVideoPreferredLayers">
                [ up ]
              </span>
            </p>
          </div>

          <div v-if="!isMe && videoCodec && consumerPriority > 0">
            <p>
              priority: {{ consumerPriority }}
              <span> </span>
              <span
                :class="{
                  clickable: consumerPriority > 1
                }"
                @click.stop="onChangeVideoPriority(consumerPriority - 1)"
              >
                [ down ]
              </span>
              <span> </span>
              <span
                :class="{
                  clickable: consumerPriority < 255
                }"
                @click.stop="onChangeVideoPriority(consumerPriority + 1)"
              >
                [ up ]
              </span>
            </p>
          </div>

          <div v-if="!isMe && videoCodec">
            <p>
              <span class="clickable" onClick="onClickRequestKeyframe">
                [ request keyframe ]
              </span>
            </p>
          </div>

          <div v-if="videoProducerId && videoScore">
            <p>streams:</p>
            <p v-for="(score, idx) in sortedVideoScores" :key="idx">
              <span v-if="score.rid !== undefined">
                rid:{{ score.rid }}, ssrc:{{ score.ssrc }}, score:{{
                  score.score
                }}
              </span>
              <span v-else>
                ssrc:{{ score.ssrc }}, score:{{ score.score }}
              </span>
            </p>
          </div>

          <div v-if="videoConsumerId && videoScore">
            {{ _printConsumerScore(videoConsumerId, videoScore) }}
          </div>
        </div>
      </div>

      <div class="peer" :class="{ 'is-me': isMe }">
        <div v-if="isMe">
          <input
            :v-model="peer.displayName"
            class="display-name editable"
            classLoading="loading"
            classInvalid="invalid"
            :shouldBlockWhileLoading="true"
            :editProps="{
              maxLength: 20,
              autoCorrect: 'false',
              spellCheck: 'false'
            }"
            @change="$emit('onChangeDisplayName', peer.displayName)"
          />
        </div>

        <div v-else>
          <span class="display-name">
            {{ peer.displayName }}
          </span>
        </div>

        <div v-if="peer.device" class="row">
          <span class="device-icon" :class="peer.device.flag" />
          <span class="device-version">
            {{ peer.device.name }} {{ peer.device.version || '' }}
          </span>
        </div>
      </div>
    </div>

    <video
      ref="videoElem"
      :class="{
        'is-me': isMe,
        hidden: !videoVisible || !videoCanPlay,
        'network-error':
          videoVisible &&
          videoMultiLayer &&
          consumerCurrentSpatialLayer === null
      }"
      autoPlay
      muted
      :controls="false"
    />

    <audio ref="audioElem" autoPlay muted :controls="false" />

    <canvas ref="canvas" class="face-detection" :class="{ 'is-me': isMe }" />

    <div class="volume-container">
      <div class="bar" :class="`level${audioVolume}`" />
    </div>

    <div v-if="videoVisible && videoScore < 5">
      <div class="spinner-container">
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>

    <div v-if="videoElemPaused">
      <div class="video-elem-paused" />
    </div>
  </div>
</template>

<script>
import hark from 'hark'
import peerViewProps from '~/components/PeerView/PeerViewProps'
export default {
  props: peerViewProps,
  data() {
    return {
      audioVolume: 0, // Integer from 0 to 10.,
      showInfo: window.SHOW_INFO || false,
      videoResolutionWidth: null,
      videoResolutionHeight: null,
      videoCanPlay: false,
      videoElemPaused: false,
      maxSpatialLayer: null,

      hark: null,
      p_videoTrack: null,
      p_audioTrack: null,
      videoResolutionPeriodicTimer: null,
      faceDetectionRequestAnimationFrame: null
    }
  },
  computed: {
    me() {
      return this.$store.state.me
    },
    sortedAudioScores() {
      const score = this.audioScore
      const scores = Array.isArray(score) ? score : [score]

      return scores.sort((a, b) => {
        if (a.rid) return a.rid > b.rid ? 1 : -1
        else return a.ssrc > b.ssrc ? 1 : -1
      })
    },
    sortedVideoScores() {
      const score = this.videoScore
      const scores = Array.isArray(score) ? score : [score]

      return scores.sort((a, b) => {
        if (a.rid) return a.rid > b.rid ? 1 : -1
        else return a.ssrc > b.ssrc ? 1 : -1
      })
    }
  },
  watch: {
    audioMuted() {
      this.$refs.audioElem.muted = this.isMe || this.audioMuted
    },
    audioTrack() {
      this._updateTracks(this.audioTrack, this.videoTrack)
    },
    videoTrack() {
      this._updateTracks(this.audioTrack, this.videoTrack)
    },
    videoRtpParameters() {
      this._updateTracks(this.audioTrack, this.videoTrack)
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.$refs.videoElem.muted = true
      this.$refs.audioElem.muted = this.isMe || this.audioMuted

      this.setTracks(this.audioTrack, this.videoTrack)
    })
  },
  methods: {
    _updateTracks(audioTrack, videoTrack) {
      if (
        this.isMe &&
        this.videoRtpParameters &&
        this.maxSpatialLayer === null
      ) {
        this.maxSpatialLayer = this.videoRtpParameters.encodings.length - 1
      } else if (
        this.isMe &&
        !this.videoRtpParameters &&
        this.maxSpatialLayer !== null
      ) {
        this.maxSpatialLayer = null
      }

      this.setTracks(audioTrack, videoTrack)
    },
    setTracks(audioTrack, videoTrack) {
      if (this.p_audioTrack === audioTrack && this.p_videoTrack === videoTrack)
        return

      this.p_audioTrack = audioTrack
      this.p_videoTrack = videoTrack

      if (this._hark) {
        this._hark.stop()
      }

      this._stopVideoResolution()

      if (this.faceDetection) {
        this._stopFaceDetection()
      }

      const { audioElem, videoElem } = this.$refs

      if (audioTrack) {
        const stream = new MediaStream()

        stream.addTrack(audioTrack)
        audioElem.srcObject = stream

        audioElem
          .play()
          .catch((error) => console.warn('audioElem.play() failed:%o', error))

        this._runHark(stream)
      } else {
        audioElem.srcObject = null
      }

      if (videoTrack) {
        const stream = new MediaStream()

        stream.addTrack(videoTrack)
        videoElem.srcObject = stream

        videoElem.oncanplay = () => {
          this.videoCanPlay = true
        }

        videoElem.onplay = () => {
          this.videoElemPaused = false

          audioElem
            .play()
            .catch((error) => console.warn('audioElem.play() failed:%o', error))
        }

        videoElem.onpause = () => {
          this.videoElemPaused = true
        }

        videoElem
          .play()
          .catch((error) => console.warn('videoElem.play() failed:%o', error))

        this._startVideoResolution()

        if (this.faceDetection) {
          this._startFaceDetection()
        }
      } else {
        videoElem.srcObject = null
      }
    },
    _printConsumerScore(id, score) {
      return `score:${score.score}, producerScore:${score.producerScore}`
    },
    _startVideoResolution() {
      const $this = this
      this.videoResolutionPeriodicTimer = setInterval(() => {
        const { videoElem } = $this.$refs

        if (
          videoElem !== undefined &&
          (videoElem.videoWidth !== $this.videoResolutionWidth ||
            videoElem.videoHeight !== $this.videoResolutionHeight)
        ) {
          $this.videoResolutionWidth = videoElem.videoWidth
          $this.videoResolutionHeight = videoElem.videoHeight
        }
      }, 500)
    },
    _runHark(stream) {
      if (!stream.getAudioTracks()[0])
        throw new Error('_runHark() | given stream has no audio track')

      this.hark = hark(stream, { play: false })

      // eslint-disable-next-line no-unused-vars
      this.hark.on('volume_change', (dBs, threshold) => {
        // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
        //   Math.pow(10, dBs / 20)
        // However it does not produce a visually useful output, so let exagerate
        // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
        // minimize component renderings.
        let audioVolume = Math.round(10 ** (dBs / 85) * 10)

        if (audioVolume === 1) audioVolume = 0

        if (audioVolume !== this.audioVolume) {
          this.audioVolume = audioVolume
        }
      })
    },
    _stopFaceDetection() {
      cancelAnimationFrame(this.faceDetectionRequestAnimationFrame)

      const { canvas } = this.$refs

      canvas.width = 0
      canvas.height = 0
    },
    _stopVideoResolution() {
      clearInterval(this.videoResolutionPeriodicTimer)

      this.videoResolutionWidth = null
      this.videoResolutionHeight = null
    },
    onClickDownSpatialLayer() {
      const newMaxSpatialLayer = this.maxSpatialLayer - 1

      this.$emit('onChangeMaxSendingSpatialLayer', newMaxSpatialLayer)
      this.maxSpatialLayer = newMaxSpatialLayer
    },

    onClickUpSpatialLayer() {
      const newMaxSpatialLayer = this.maxSpatialLayer + 1

      this.$emit('onChangeMaxSendingSpatialLayer', newMaxSpatialLayer)
      this.maxSpatialLayer = newMaxSpatialLayer
    },

    onClickDownVideoPreferredLayers() {
      let newPreferredSpatialLayer = this.consumerPreferredSpatialLayer
      let newPreferredTemporalLayer

      if (this.consumerPreferredTemporalLayer > 0) {
        newPreferredTemporalLayer = this.consumerPreferredTemporalLayer - 1
      } else {
        if (this.consumerPreferredSpatialLayer > 0)
          newPreferredSpatialLayer = this.consumerPreferredSpatialLayer - 1
        else newPreferredSpatialLayer = this.consumerSpatialLayers - 1

        newPreferredTemporalLayer = this.consumerTemporalLayers - 1
      }

      this.$emit(
        'onChangeVideoPreferredLayers',
        newPreferredSpatialLayer,
        newPreferredTemporalLayer
      )
    },

    onClickUpVideoPreferredLayers() {
      let newPreferredSpatialLayer = this.consumerPreferredSpatialLayer
      let newPreferredTemporalLayer

      if (
        this.consumerPreferredTemporalLayer <
        this.consumerTemporalLayers - 1
      ) {
        newPreferredTemporalLayer = this.consumerPreferredTemporalLayer + 1
      } else {
        if (this.consumerPreferredSpatialLayer < this.consumerSpatialLayers - 1)
          newPreferredSpatialLayer = this.consumerPreferredSpatialLayer + 1
        else newPreferredSpatialLayer = 0

        newPreferredTemporalLayer = 0
      }

      this.$emit(
        'onChangeVideoPreferredLayers',
        newPreferredSpatialLayer,
        newPreferredTemporalLayer
      )
    },

    onStatsClick() {
      if (this.isMe) {
        this.$emit('onStatsClick', this.me.id)
      } else {
        this.$emit('onStatsClick', this.peer.id)
      }
    },
    onClickRequestKeyframe() {
      this.$emit('onRequestKeyFrame')
    },
    onChangeVideoPriority(priority) {
      this.$emit('onChangeVideoPriority', priority)
    }
  }
}
</script>
