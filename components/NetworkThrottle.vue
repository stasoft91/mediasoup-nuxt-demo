<template>
  <form data-component="NetworkThrottle" @submit.prevent="_apply">
    <h1 class="draggable">Network Throttle</h1>

    <div class="inputs">
      <div class="row">
        <p class="key">
          UPLINK (kbps)
        </p>

        <input
          v-model="uplink"
          class="value"
          type="text"
          placeholder="NO LIMIT"
          :disabled="disabled"
          pattern="[0-9]*"
          value="{uplink}"
          spellCheck="false"
        />
      </div>

      <div class="row">
        <p class="key">
          DOWNLINK (kbps)
        </p>

        <input
          v-model="downlink"
          class="value"
          type="text"
          placeholder="NO LIMIT"
          :disabled="disabled"
          pattern="[0-9]*"
          autoCorrect="false"
          spellCheck="false"
        />
      </div>

      <div class="row">
        <p class="key">
          RTT (ms)
        </p>

        <input
          class="value"
          type="text"
          placeholder="NOT SET"
          :disabled="disabled"
          pattern="[0-9]*"
          value="{rtt}"
          spellCheck="false"
        />
      </div>
    </div>

    <div class="buttons">
      <button
        type="button"
        class="reset"
        :disabled="disabled"
        @click="_reset()"
      >
        RESET
      </button>

      <button
        type="submit"
        class="apply"
        :disabled="
          disabled || (!uplink.trim() && !downlink.trim() && !rtt.trim())
        "
      >
        APPLY
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    secret: {
      type: String,
      required: true
    },
    roomClient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downlink: '',
      disabled: false,
      uplink: '',
      rtt: ''
    }
  },
  beforeDestroy() {
    this.roomClient.resetNetworkThrottle({ silent: true })
  },
  methods: {
    async _apply() {
      this.uplink = Number(this.uplink) || 0
      this.downlink = Number(this.downlink) || 0
      this.rtt = Number(this.rtt) || 0

      this.disabled = true

      await this.roomClient.applyNetworkThrottle({
        uplink: this.uplink,
        downlink: this.downlink,
        rtt: this.rtt,
        secret: this.secret
      })

      window.onunload = () => {
        this.roomClient.resetNetworkThrottle({
          silent: true,
          secret: this.secret
        })
      }

      this.disabled = false
    },

    async _reset() {
      this.uplink = ''
      this.downlink = ''
      this.rtt = ''
      this.disabled = false

      this.disabled = true

      await this.roomClient.resetNetworkThrottle({ secret: this.secret })
      this.disabled = false
    }
  }
}
</script>
