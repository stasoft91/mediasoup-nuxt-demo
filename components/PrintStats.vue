<template>
  <transition appear>
    <div class="items">
      <h2 :id="anchor">{{ title }}</h2>

      <div v-for="(item, idx) in stats" :key="idx" class="item">
        <div v-for="(stat, key) in item" :key="key" class="line">
          <p class="key">{{ key }}</p>
          <div class="value">
            <span v-if="typeof stat === 'number'">
              {{ stringify(percent(stat)) }}
            </span>

            <span v-else>
              <pre>{{ stringify(stat) }}</pre>
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    stats: {
      type: [RTCStatsReport, Array],
      required: true
    }
  },
  computed: {
    anchor() {
      return this.title.replace(/[ ]+/g, '-')
    }
  },
  methods: {
    stringify(json) {
      return JSON.stringify(json, null, '  ')
    },
    percent(stat) {
      return Math.round(stat * 100) / 100
    }
  }
}
</script>
