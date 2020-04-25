export const state = () => ({
  consumers: []
})

export const mutations = {
  setRoomState(state, payload) {
    if (payload.state === 'closed') {
      state.consumers = []
    }
  },

  addConsumer(state, payload) {
    state.consumers.push(payload.consumer)
  },

  removeConsumer(state, payload) {
    const consumerId = payload.consumerId

    state.consumers = state.consumers.filter(
      (consumer) => consumer.id !== consumerId
    )
  },

  setConsumerPaused(state, payload) {
    const { consumerId, originator } = payload
    const consumer = state.consumers.find(
      (consumer) => consumer.id === consumerId
    )

    if (originator === 'local') {
      consumer.locallyPaused = true
    } else {
      consumer.remotelyPaused = true
    }
  },

  setConsumerResumed(state, payload) {
    const { consumerId, originator } = payload
    const consumer = state.consumers.find(
      (consumer) => consumer.id === consumerId
    )

    if (originator === 'local') {
      consumer.locallyPaused = false
    } else {
      consumer.remotelyPaused = false
    }
  },

  setConsumerCurrentLayers(state, payload) {
    const { consumerId, spatialLayer, temporalLayer } = payload
    const consumer = state.consumersfind(
      (consumer) => consumer.id === consumerId
    )

    consumer.currentSpatialLayer = spatialLayer
    consumer.currentTemporalLayer = temporalLayer
  },

  setConsumerPreferredLayers(state, payload) {
    const { consumerId, spatialLayer, temporalLayer } = payload
    const consumer = state.consumers.find(
      (consumer) => consumer.id === consumerId
    )

    consumer.preferredSpatialLayer = spatialLayer
    consumer.preferredTemporalLayer = temporalLayer
  },

  setConsumerPriority(state, payload) {
    const { consumerId, priority } = payload
    const consumer = state.consumers.find(
      (consumer) => consumer.id === consumerId
    )

    consumer.priority = priority
  },

  setConsumerTrack(state, payload) {
    const { consumerId, track } = payload
    const consumer = state.consumers.find(
      (consumer) => consumer.id === consumerId
    )

    consumer.track = track
  },

  setConsumerScore(state, payload) {
    const { consumerId, score } = payload
    const consumer = state.consumers.find(
      (consumer) => consumer.id === consumerId
    )

    consumer.score = score
  }
}
