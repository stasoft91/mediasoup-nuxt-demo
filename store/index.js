import randomString from '~/utils/randomString'

export const actions = {
  notify(
    { state, commit, rootState },
    { type = 'info', text, title, timeout }
  ) {
    if (!timeout) {
      switch (type) {
        case 'info':
          timeout = 3000
          break
        case 'error':
          timeout = 5000
          break
      }
    }

    const notification = {
      id: randomString(6),
      type,
      title,
      text,
      timeout
    }

    commit('notifications/addNotification', notification)

    setTimeout(() => {
      commit('notifications/removeNotification', notification.id)
    }, timeout)
  }
}
