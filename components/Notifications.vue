<template>
  <div data-component="Notifications">
    <transition
      v-for="notification in notifications"
      :key="notification.id"
      appear
    >
      <div
        class="notification"
        :class="notification.type"
        @click="removeNotification(notification.id)"
      >
        <div class="icon" />

        <div class="body">
          <p v-if="notification.title" class="title">
            {{ notification.title }}
          </p>

          <p class="text">{{ notification.text }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    notifications() {
      return this.$store.state.notifications.notifications
    }
  },
  methods: {
    removeNotification(notificationId) {
      this.$store.commit('notifications/removeNotification', { notificationId })
    }
  }
}
</script>
