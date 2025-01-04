<script>
import DiverFactory from '../factories/diverFactory';
import Disclaimer from '../components/Disclaimer.vue';
import Compartments from '../components/Compartments.vue';

const MAX_MINUTES = 1000000;

export default {
  data() {
    return {
      showResult: false,
      noDecoTime: 0,
      formData: {
        depth: null,
      },
      compartments: null
    };
  },
  components: {
    Disclaimer,
    Compartments
  },
  methods: {
    calculateNoDeco() {
      const diver = DiverFactory.createTmpRecreationalDiver();

      diver.moveTo(parseInt(this.formData.depth));
      this.noDecoTime = diver.stayMaxNoDeco();
      diver.moveTo(0);

      this.compartments = diver.compartments;
      this.showResult = true;
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>No-Deco calculation</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <Disclaimer />
      </v-row>
      <v-row>
        <v-container>
          <p>Enter the planned maximum depth to calculate the no-deco deep time.</p>
          <p>This calculation accounts for the descent(18 meters/min) duration but <strong>doesn't account for the ascent duration</strong>.</p>
        </v-container>
      </v-row>
      <v-row>
        <v-col cols="3"/>
        <v-col cols="6">
          <v-form @submit.prevent="calculateNoDeco">
            <v-text-field
              v-model="formData.depth"
              label="Enter depth"
              type="number"
              required
              full-width
            ></v-text-field>
            <v-btn color="primary" @click="calculateNoDeco" :disabled="!formData.depth">
              Calculate
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="3"/>
      </v-row>
      <v-row v-if="showResult">
        <v-col cols="12">
          <p>No-deco time: <strong>{{ noDecoTime.toFixed(2) }} minutes</strong></p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <Compartments :compartments="compartments"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
