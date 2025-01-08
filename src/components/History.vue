<script>
export default {
  data() {
    return {
      selectedIndex: (this.history.length - 1)
    };
  },
  props: {
    history: {
      type: Array,
      required: true
    }
  },
  computed: {
    wayPoint() {
      return this.history[this.selectedIndex];
    }
  },
  watch: {
    selectedIndex(newValue) {
      this.wayPoint = this.history[newValue];

      this.$emit('history-selected', this.wayPoint);
    }
  }
}
</script>

<template>
  <container>
    <v-row>
      <v-col cols="12">
        <h3>History</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-slider
          v-model="selectedIndex"
          :max="this.history.length - 1"
          show-ticks="always"
          step="1"
          tick-size="4" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="wayPoint !== null" cols="12">
        <strong>Depth:</strong> {{wayPoint.depth}} meters
      </v-col>
    </v-row>
  </container>
</template>
