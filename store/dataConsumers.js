export const state = () => ({
  dataConsumers: []
})

export const mutations = {
  setRoomState(state, payload) {
    if (payload.state === 'closed') {
      state.dataConsumers = []
    }
  },

  addDataConsumer(state, payload) {
    const { dataConsumer } = payload
    state.dataConsumers.push(dataConsumer)
  },

  removeDataConsumer(state, payload) {
    const { dataConsumerId } = payload
    state.dataConsumers = state.dataConsumers.filter(
      (consumer) => consumer.id !== dataConsumerId
    )
  }
}
