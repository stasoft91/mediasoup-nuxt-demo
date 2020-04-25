export const state = () => ({
  producers: []
})

export const mutations = {
  setRoomState(state, payload) {
    if (payload.state === 'closed') {
      state.producers = []
    }
  },

  addProducer(state, payload) {
    const { producer } = payload

    state.producers.push(producer)
  },

  removeProducer(state, payload) {
    const { producerId } = payload

    state.producers = state.producers.filter(
      (producer) => producer.id !== producerId
    )
  },

  setProducerPaused(state, payload) {
    const { producerId } = payload

    const producer = state.producers.find(
      (producer) => producer.id === producerId
    )

    producer.paused = true
  },

  setProducerResumed(state, payload) {
    const { producerId } = payload

    const producer = state.producers.find(
      (producer) => producer.id === producerId
    )

    producer.paused = false
  },

  setProducerTrack(state, payload) {
    const { producerId, track } = payload

    const producer = state.producers.find(
      (producer) => producer.id === producerId
    )

    producer.track = track
  },

  setProducerScore(state, payload) {
    const { producerId, score } = payload

    const producer = state.producers.find(
      (producer) => producer.id === producerId
    )

    producer.score = score
  }
}
