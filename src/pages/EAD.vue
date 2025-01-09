<script>
import GasFactory from '../factories/gasFactory';
import Disclaimer from '../components/Disclaimer.vue';

export default {
  data() {
    return {
      O2Ratio: null,
      depth: null
    };
  },
  components: {
    Disclaimer
  },
  computed: {
    givenRatio() {
      return parseInt(this.O2Ratio);
    },
    givenDepth() {
      return parseInt(this.depth);
    },
    EAD() {
      const gas = GasFactory.createTmpNitrox(this.givenRatio);

      return gas.EAD(this.givenDepth);
    },
    validO2() {
      return !isNaN(this.givenRatio) && this.givenRatio > 0 && this.givenRatio <= 100;
    },
    validDepth() {
      return !isNaN(this.givenDepth) && this.givenDepth > 0;
    },
    showResult() {
      return this.validO2 && this.validDepth;
    },
    showError() {
      return this.isValueEntered(this.O2Ratio) && this.isValueEntered(this.depth) && !this.showResult;
    }
  },
  methods: {
    isValueEntered(value) {
      return value !== null && value !== '';
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>EAD Calculation</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <Disclaimer />
      </v-row>
      <v-row>
        <v-container>
          <p>Enter the O<sub>2</sub> ratio of the gas and the depth to calculate the equivalent air depth.</p>
        </v-container>
      </v-row>
      <v-row>
        <v-col md="2" cols="12" />
        <v-col md="4" cols="12" >
          <v-text-field
            v-model="O2Ratio"
            label="Enter oxygen ratio"
            type="number"
            suffix="%"
            hide-details
            full-width
          ></v-text-field>
        </v-col>
        <v-col md="4" cols="12" >
          <v-text-field
            v-model="depth"
            label="Enter depth"
            type="number"
            suffix="meters"
            hide-details
            full-width
          ></v-text-field>
        </v-col>
        <v-col md="2" cols="12" />
      </v-row>
      <v-row>
        <v-col cols="12">
          <container v-if="!(showResult || showError)"><p>&nbsp;</p></container>
          <container v-if="showResult">
            <p>Equivalent air depth of EANx{{O2Ratio}} is <strong>{{ EAD.toFixed(2) }} meters</strong></p>
          </container>
          <container v-if="showError">
            <p>Incorrect value entered!</p>
          </container>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
