<script>
import GasFactory from '../factories/gasFactory';
import Disclaimer from '../components/Disclaimer.vue';

export default {
  data() {
    return {
      O2Ratio: null,
      isDeco: false
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
      const gas = GasFactory.createTmpNitrox(this.givenRatio, this.isDeco);

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
      <v-row class="flex-row-reverse">
        <v-col md="3" cols="12" class="d-flex justify-md-start align-center justify-center" >
          <v-switch
            v-model="isDeco"
            color="red"
            label="Deco Gas?"
            hide-details />
        </v-col>
        <v-col md="6" cols="12" >
          <v-text-field
            v-model="O2Ratio"
            label="Enter oxygen ratio"
            type="number"
            suffix="%"
            hide-details
            full-width
          ></v-text-field>
        </v-col>
        <v-col md="3" cols="12" />
      </v-row>
      <v-row>
        <v-col cols="12">
          <container v-if="!(showResult || showError)"><p>&nbsp;</p></container>
          <container v-if="showResult">
            <p>Maximum operating depth of {{O2Ratio}}% O<sub>2</sub> <span v-if="isDeco" class="text-red"><strong>in deco mode</strong></span> is <strong>{{ MOD.toFixed(2) }} meters</strong></p>
          </container>
          <container v-if="showError">
            <p>Incorrect value entered!</p>
          </container>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
