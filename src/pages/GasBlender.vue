<script>
import BlendFactory from '../factories/blendFactory';
import Disclaimer from '../components/Disclaimer.vue';

export default {
  data() {
    return {
      startPressure: 0,
      startO2: 21,
      targetPressure: null,
      targetO2: null
    };
  },
  components: {
    Disclaimer
  },
  computed: {
    parsedStartPressure() {
      return parseFloat(this.startPressure);
    },
    parsedStartO2() {
      return parseFloat(this.startO2);
    },
    parsedTargetPressure() {
      return parseFloat(this.targetPressure);
    },
    parsedTargetO2() {
      return parseFloat(this.targetO2);
    },
    blend() {
      return BlendFactory.create(
        this.parsedStartPressure,
        this.parsedStartO2,
        this.parsedTargetPressure,
        this.parsedTargetO2
      );
    },
    inputsValid() {
      return this.isValidNumber(this.parsedStartPressure, 0, 1000) &&
        this.isValidNumber(this.parsedStartO2, 0, 100) &&
        this.isValidNumber(this.parsedTargetPressure, 0, 1000) &&
        this.isValidNumber(this.parsedTargetO2, 0, 100);
    },
    showResult() {
      return this.inputsValid && this.blend.valid();
    },
    showError() {
      return this.allValuesEntered && !this.showResult;
    },
    allValuesEntered() {
      return this.isValueEntered(this.startPressure) &&
        this.isValueEntered(this.startO2) &&
        this.isValueEntered(this.targetPressure) &&
        this.isValueEntered(this.targetO2);
    }
  },
  methods: {
    isValueEntered(value) {
      return value !== null && value !== '';
    },
    isValidNumber(value, min, max) {
      return !isNaN(value) && value >= min && value <= max;
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>Gas Blender</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <Disclaimer />
      </v-row>
      <v-row>
        <v-container>
          <p>Calculate how much pure O<sub>2</sub> to add and the final top-up pressure with air to blend a Nitrox mix using the partial pressure method.</p>
        </v-container>
      </v-row>
      <v-row>
        <v-col md="2" cols="12" />
        <v-col md="4" cols="12">
          <v-text-field
            v-model="startPressure"
            label="Starting tank pressure"
            type="number"
            suffix="bar"
            hide-details
            full-width
          ></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-text-field
            v-model="startO2"
            label="Starting O₂ ratio"
            type="number"
            suffix="%"
            hide-details
            full-width
          ></v-text-field>
        </v-col>
        <v-col md="2" cols="12" />
      </v-row>
      <v-row>
        <v-col md="2" cols="12" />
        <v-col md="4" cols="12">
          <v-text-field
            v-model="targetPressure"
            label="Target tank pressure"
            type="number"
            suffix="bar"
            hide-details
            full-width
          ></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-text-field
            v-model="targetO2"
            label="Target O₂ ratio"
            type="number"
            suffix="%"
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
            <p>Add <strong>{{ blend.o2ToAdd().toFixed(2) }} bar</strong> of pure O<sub>2</sub>, then top up with air to <strong>{{ parsedTargetPressure.toFixed(2) }} bar</strong> (add <strong>{{ blend.airToAdd().toFixed(2) }} bar</strong> of air).</p>
          </container>
          <container v-if="showError">
            <p>Incorrect or inconsistent values entered!</p>
          </container>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
