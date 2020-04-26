export default {
  peer: {
    type: Object,
    required: true
  },
  isMe: {
    type: Boolean,
    default: false
  },
  audioProducerId: {
    type: String,
    default: null
  },
  videoProducerId: {
    type: String,
    default: null
  },
  audioConsumerId: {
    type: String,
    default: null
  },
  videoConsumerId: {
    type: String,
    default: null
  },
  audioRtpParameters: {
    type: Object,
    default: null
  },
  videoRtpParameters: {
    type: Object,
    default: null
  },
  consumerSpatialLayers: {
    type: Number,
    default: null
  },
  consumerTemporalLayers: {
    type: Number,
    default: null
  },
  consumerCurrentSpatialLayer: {
    type: Number,
    default: null
  },
  consumerCurrentTemporalLayer: {
    type: Number,
    default: null
  },
  consumerPreferredSpatialLayer: {
    type: Number,
    default: null
  },
  consumerPreferredTemporalLayer: {
    type: Number,
    default: null
  },
  consumerPriority: {
    type: Number,
    default: null
  },
  audioTrack: {
    type: MediaStreamTrack,
    default: null
  },
  videoTrack: {
    type: MediaStreamTrack,
    default: null
  },
  audioMuted: {
    type: Boolean,
    default: false
  },
  videoVisible: {
    type: Boolean,
    required: true
  },
  videoMultiLayer: {
    type: Boolean,
    required: false
  },
  audioCodec: {
    type: String,
    default: null
  },
  videoCodec: {
    type: String,
    default: null
  },
  audioScore: {
    type: [Object, Array],
    default: null
  },
  videoScore: {
    type: [Object, Array],
    default: null
  },
  faceDetection: {
    type: Boolean,
    required: true
  }
}
