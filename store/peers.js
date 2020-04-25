export const state = () => ({
  peers: []
})

export const mutations = {
  setRoomState(state, payload) {
    if (payload.state === 'closed') {
      state.peers = []
    }
  },

  addPeer(state, payload) {
    const { peer } = payload

    state.peers.push(peer)
  },

  removePeer(state, payload) {
    const { peerId } = payload

    state.peers = state.peers.filter((peer) => peer.id !== peerId)
  },

  setPeerDisplayName(state, payload) {
    const { displayName, peerId } = payload
    const peer = state.peers.find((peer) => peer.id === peerId)

    if (!peer) {
      throw new Error('no Peer found')
    }

    state.peer.displayName = displayName
  },

  addConsumer(state, payload) {
    const { consumer, peerId } = payload
    const peer = state.peers.find((peer) => peer.id === peerId)

    if (!peer) {
      throw new Error('no Peer found for new Consumer')
    }

    peer.consumers.push(consumer.id)
  },

  removeConsumer(state, payload) {
    const { consumerId, peerId } = payload
    const peer = state.peers.find((peer) => peer.id === peerId)

    // NOTE: This means that the Peer was closed before, so it's ok.
    if (!peer) {
      return
    }

    peer.consumers = peer.consumers.filter(
      (consumer) => consumer === consumerId
    )
  },

  addDataConsumer(state, payload) {
    const { dataConsumer, peerId } = payload

    // special case for bot DataConsumer.
    if (!peerId) {
      return
    }

    const peer = state.peers.find((peer) => peer.id === peerId)

    if (!peer) {
      throw new Error('no Peer found for new DataConsumer')
    }

    peer.dataConsumers.push(dataConsumer.id)
  },

  removeDataConsumer(state, payload) {
    const { dataConsumerId, peerId } = payload

    // special case for bot DataConsumer.
    if (!peerId) {
      return
    }

    const peer = state.peers.find((peer) => peer.id === peerId)

    // NOTE: This means that the Peer was closed before, so it's ok.
    if (!peer) {
      return
    }

    peer.dataConsumers = peer.dataConsumers.filter(
      (dataConsumer) => dataConsumer === dataConsumerId
    )
  }
}
