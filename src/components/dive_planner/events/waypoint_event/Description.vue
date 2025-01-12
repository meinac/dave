<script>
export default {
  props: {
    event: {
      type: Object,
      required: true
    },
    previousEvent: {
      type: Object,
      required: true
    }
  },
  computed: {
    action() {
      if(this.previousEvent === null) return;

      if(this.event.depth > this.previousEvent.depth) {
        return 'descent';
      } else if(this.event.depth < this.previousEvent.depth) {
        return 'ascent';
      } else {
        return 'stay'
      }
    }
  }
}
</script>

<template>
  <span v-if="action === 'descent'">
    <v-icon left>mdi-arrow-down</v-icon>
    Descend to <strong>{{event.depth}} meters</strong> in <strong>{{event.duration}} minutes</strong>.
  </span>

  <span v-if="action === 'ascent'">
    <v-icon left>mdi-arrow-up</v-icon>
    Ascend to <strong>{{event.depth}} meters</strong> in <strong>{{event.duration}} minutes</strong>.
  </span>

  <span v-if="action === 'stay'">
    <v-icon left>mdi-arrow-right</v-icon>
    Stay at <strong>{{event.depth}} meters</strong> for <strong>{{event.duration}} minutes</strong>.
  </span>
</template>
