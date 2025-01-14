<script>
import Time from '../../../utils/time';

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    time() {
      const time = this.data[0].value[0];

      return Time.humanizeMinutes(time);
    },
    diveProfile() {
      return this.diveProfileData.value[1].toFixed(2);
    },
    TTS() {
      const TTS = this.diveProfileData.data.TTS;

      if(TTS === undefined) return;

      return Time.humanizeMinutes(TTS);
    },
    decoCeiling() {
      const decoCeiling = this.decoCeilingData;

      if(decoCeiling === undefined) return;

      return decoCeiling.value[1];
    },
    NOTOX() {
      const NOTOX = this.NOTOXData;

      if(NOTOX === undefined) return;

      return NOTOX.data.extra.name;
    },
    diveProfileData() {
      return this.data.find(item => item.seriesName === 'Dive Profile');
    },
    decoCeilingData() {
      const data = this.data.filter(item => item.seriesName === 'Deco ceiling')
                            .sort((a, b) => b.value[1] - a.value[1]);

      return data[0];
    },
    NOTOXData() {
      return this.data.find(item => item.data.type === 'NOTOX');
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h3>{{time}}</h3>
    </v-col>
  </v-row>
  <v-divider/>
  <v-row>
    <v-col cols="12">
      <p>
        <v-icon left>mdi-arrow-bottom-right</v-icon>Depth: <strong>{{diveProfile}} meters</strong>
      </p>
      <p v-if="TTS">
        <v-icon left>mdi-sort-clock-descending</v-icon>TTS: <strong>{{TTS}}</strong>
      </p>
      <p v-if="decoCeiling">
        <v-icon left>mdi-arrow-collapse-up</v-icon>Deco Ceiling: <strong>{{decoCeiling}} meters</strong>
      </p>
      <p v-if="NOTOX">
        <v-icon left>mdi-gas-cylinder</v-icon>NOTOX: <strong>{{NOTOX}}</strong>
      </p>
    </v-col>
  </v-row>
</template>

<style scoped>
  p {
    text-align: left;
    padding:  5px;
  }
  i {
    margin-right:  5px;
  }
</style>
