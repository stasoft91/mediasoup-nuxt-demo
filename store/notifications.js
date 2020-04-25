export const state = () => ({
  notifications: []
})

export const mutations = {
  addNotification(state, payload) {
    const notification = payload

    state.notifications.push(notification)
  },

  removeNotification(state, payload) {
    const { notificationId } = payload

    state.notifications = state.notifications.filter(
      (notification) => notification.id !== notificationId
    )
  },

  removeAllNotifications(state) {
    state.notifications = []
  }
}
