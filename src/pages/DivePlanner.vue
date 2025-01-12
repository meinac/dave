<script>
import Settings from '../components/dive_planner/Settings.vue';
import Events from '../components/dive_planner/Events.vue';
import GasManagement from '../components/dive_planner/GasManagement.vue';
import DiveProfile from '../components/dive_planner/DiveProfile.vue';
import Compartments from '../components/Compartments.vue';
import History from '../components/History.vue';

import DiveFactory from '../factories/diveFactory';

export default {
  components: {
    Settings,
    Events,
    GasManagement,
    DiveProfile,
    Compartments,
    History
  },
  data() {
    return {
      version: null,
      gasses: [],
      events: [],
      startGas: null,
      sacRate: null,
      decoSacRate: null,
      compartments: null,
      history: null,
      autoEndDive: true
    }
  },
  methods: {
    updateAutoEndDive(newValue) {
      this.autoEndDive = newValue;

      this.updateGraph();
    },
    updateStartGas(newStartGas) {
      this.startGas = newStartGas;

      this.updateGraph();
    },
    updateSacRate(newSacRate) {
      this.sacRate = newSacRate;

      this.updateGraph();
    },
    updateDecoSacRate(newDecoSacRate) {
      this.decoSacRate = newDecoSacRate;

      this.updateGraph();
    },
    addGas(newGas) {
      this.gasses.push(newGas);

      this.updateGraph();
    },
    updateGas(gas) {
      this.updateGraph();
    },
    removeGas(index) {
      this.version = crypto.randomUUID();
      const gas = this.gasses[index];

      this.gasses.splice(index, 1);
      this.$refs.eventsComponent.removeGas(gas);
    },
    updateEvents(events) {
      this.events = events;

      this.updateGraph();
    },
    changeCompartments(selectedHistory) {
      this.compartments = selectedHistory.compartments;
    },
    updateGraph() {
      this.version = crypto.randomUUID();
    }
  },
  computed: {
    dive() {
      const dive = DiveFactory.create(this.startGas, this.sacRate, this.decoSacRate);

      dive.execute(this.events);

      if(this.autoEndDive) dive.autoComplete();

      this.compartments = dive.diver.compartments;
      this.history = dive.diver.history;

      return dive;
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>Dive Planner</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <Settings
        @autoEndDive-updated="updateAutoEndDive" />
    </v-col>
  </v-row>
  <v-row>
    <v-col md="6" cols="12">
      <Events
        ref="eventsComponent"
        :gasses="gasses"
        @events-updated="updateEvents" />
    </v-col>
    <v-col md="6" cols="12">
      <GasManagement
        @startGas-changed="updateStartGas"
        @sacRate-changed="updateSacRate",
        @decoSacRate-changed="updateDecoSacRate"
        @gas-added="addGas"
        @gas-updated="updateGas"
        @gas-removed="removeGas" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <DiveProfile :dive="dive" :key="version" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <Compartments :compartments="compartments"/>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" v-if="history !== null">
      <History :history="history" @history-selected="changeCompartments" :key="history" />
    </v-col>
  </v-row>
</template>
