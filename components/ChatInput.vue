<template>
  <div data-component="ChatInput">
    <textarea
      ref="textareaElem"
      v-model="text"
      :placeholder="disabled ? 'Chat unavailable' : 'Write here...'"
      dir="auto"
      autoComplete="off"
      :disabled="disabled"
      @keypress="handleKeyPress"
    />
  </div>
</template>

<script>
const BotMessageRegex = new RegExp('^@bot (.*)')

export default {
  props: {
    roomClient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      text: ''
    }
  },
  computed: {
    disabled() {
      return (
        !this.connected || (!this.chatDataProducer && !this.botDataProducer)
      )
    },
    connected() {
      return this.$store.state.room.state
    },
    chatDataProducer() {
      const dataProducersArray = this.$store.state.dataProducers.dataProducers

      return dataProducersArray.find(
        (dataProducer) => dataProducer.label === 'chat'
      )
    },
    botDataProducer() {
      const dataProducersArray = this.$store.state.dataProducers.dataProducers

      return dataProducersArray.find(
        (dataProducer) => dataProducer.label === 'bot'
      )
    }
  },
  methods: {
    handleKeyPress(event) {
      // If Shift + Enter do nothing.
      if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey) return

      // Don't add the sending Enter into the value.
      event.preventDefault()

      let text = this.text.trim()

      this.text = ''

      if (text) {
        const match = BotMessageRegex.exec(text)

        // Chat message.
        if (!match) {
          text = text.trim()

          this.roomClient.sendChatMessage(text)
        }
        // Message to the bot.
        else {
          text = match[1].trim()

          this.roomClient.sendBotMessage(text)
        }
      }
    }
  }
}
</script>
