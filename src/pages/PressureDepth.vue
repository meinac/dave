<script>
import WaterColumn from '../models/waterColumn';
import Disclaimer from '../components/Disclaimer.vue';

export default {
  data() {
    return {
      mode: 'depthToPressure',
      depth: null,
      pressure: null,
      waterType: WaterColumn.SALT_WATER,
      altitude: 0,
      pressureType: 'absolute'
    };
  },
  components: {
    Disclaimer
  },
  computed: {
    givenDepth() {
      return parseFloat(this.depth);
    },
    givenPressure() {
      return parseFloat(this.pressure);
    },
    givenAltitude() {
      const altitude = parseFloat(this.altitude);
      return isNaN(altitude) ? 0 : altitude;
    },
    isDepthMode() {
      return this.mode === 'depthToPressure';
    },
    isPressureMode() {
      return this.mode === 'pressureToDepth';
    },
    validDepth() {
      return !isNaN(this.givenDepth) && this.givenDepth >= 0;
    },
    validPressure() {
      return !isNaN(this.givenPressure) && this.givenPressure >= 0;
    },
    showDepthResult() {
      return this.isDepthMode && this.validDepth;
    },
    showPressureResult() {
      return this.isPressureMode && this.validPressure;
    },
    showError() {
      if (this.isDepthMode) {
        return this.depth !== null && this.depth !== '' && !this.validDepth;
      }
      return this.pressure !== null && this.pressure !== '' && !this.validPressure;
    },
    absolutePressure() {
      return WaterColumn.absolutePressureAt(this.givenDepth, this.waterType, this.givenAltitude);
    },
    gaugePressure() {
      return WaterColumn.gaugePressureAt(this.givenDepth, this.waterType);
    },
    computedDepth() {
      if (this.pressureType === 'absolute') {
        return WaterColumn.depthFromAbsolutePressure(this.givenPressure, this.waterType, this.givenAltitude);
      }
      return WaterColumn.depthFromGaugePressure(this.givenPressure, this.waterType);
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>Pressure / Depth Converter</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <Disclaimer />
      </v-row>
      <v-row>
        <v-container>
          <p>Convert between depth and ambient pressure for fresh or salt water, with optional altitude correction.</p>
        </v-container>
      </v-row>
      <v-row>
        <v-col md="4" cols="12">
          <v-select
            v-model="mode"
            :items="[
              { title: 'Depth → Pressure', value: 'depthToPressure' },
              { title: 'Pressure → Depth', value: 'pressureToDepth' }
            ]"
            item-title="title"
            item-value="value"
            label="Conversion mode"
            hide-details
          ></v-select>
        </v-col>
        <v-col md="4" cols="12">
          <v-select
            v-model="waterType"
            :items="[
              { title: 'Salt water', value: 'salt' },
              { title: 'Fresh water', value: 'fresh' }
            ]"
            item-title="title"
            item-value="value"
            label="Water type"
            hide-details
          ></v-select>
        </v-col>
        <v-col md="4" cols="12">
          <v-text-field
            v-model="altitude"
            label="Altitude"
            type="number"
            suffix="meters"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="isDepthMode">
        <v-col md="2" cols="12" />
        <v-col md="8" cols="12">
          <v-text-field
            v-model="depth"
            label="Enter depth"
            type="number"
            suffix="meters"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col md="2" cols="12" />
      </v-row>
      <v-row v-if="isPressureMode">
        <v-col md="4" cols="12">
          <v-select
            v-model="pressureType"
            :items="[
              { title: 'Absolute (bar)', value: 'absolute' },
              { title: 'Gauge (bar)', value: 'gauge' }
            ]"
            item-title="title"
            item-value="value"
            label="Pressure type"
            hide-details
          ></v-select>
        </v-col>
        <v-col md="8" cols="12">
          <v-text-field
            v-model="pressure"
            label="Enter pressure"
            type="number"
            suffix="bar"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <container v-if="showDepthResult">
            <p>At <strong>{{ givenDepth.toFixed(2) }} m</strong> in {{ waterType }} water (altitude {{ givenAltitude }} m):</p>
            <p>Absolute pressure: <strong>{{ absolutePressure.toFixed(3) }} bar</strong></p>
            <p>Gauge pressure: <strong>{{ gaugePressure.toFixed(3) }} bar</strong></p>
          </container>
          <container v-if="showPressureResult">
            <p>{{ pressureType === 'absolute' ? 'Absolute' : 'Gauge' }} pressure of <strong>{{ givenPressure.toFixed(3) }} bar</strong> in {{ waterType }} water (altitude {{ givenAltitude }} m):</p>
            <p>Equivalent depth: <strong>{{ computedDepth.toFixed(2) }} meters</strong></p>
          </container>
          <container v-if="showError">
            <p>Incorrect value entered!</p>
          </container>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
