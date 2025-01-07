<script>
import GasFactory from '../factories/gasFactory';
import Disclaimer from '../components/Disclaimer.vue';

export default {
  data() {
    return {
      O2Ratio: null
    };
  },
  components: {
    Disclaimer
  },
  computed: {
    givenRatio() {
      return parseInt(this.O2Ratio);
    },
    MOD() {
      const gas = GasFactory.createTmpNitrox(this.givenRatio);

      return gas.MOD();
    },
    showResult() {
      return !isNaN(this.givenRatio) && this.givenRatio > 0 && this.givenRatio <= 100;
    },
    showError() {
      return this.O2Ratio !== null && this.O2Ratio !== '' && !this.showResult;
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>MOD Calculation</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <Disclaimer />
      </v-row>
      <v-row>
        <v-container>
          <p>Enter the O<sub>2</sub> ratio of the gas to calculate the maximum operating depth.</p>
        </v-container>
      </v-row>
      <v-row>
        <v-col cols="3" />
        <v-col cols="6">
          <v-text-field
            v-model="O2Ratio"
            label="Enter oxygen ratio"
            type="number"
            full-width
          ></v-text-field>
        </v-col>
        <v-col cols="3" />
      </v-row>
      <v-row v-if="showResult">
        <v-col cols="12">
          <p>Maximum operating depth of {{O2Ratio}}% O<sub>2</sub> is <strong>{{ MOD.toFixed(2) }} meters</strong></p>
        </v-col>
      </v-row>
      <v-row v-if="showError">
        <v-col cols="12">
          <p>Incorrect value entered!</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
