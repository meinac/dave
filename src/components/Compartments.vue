<script>
  import CompartmentLoad from '../components/CompartmentLoad.vue';

  export default {
    props: {
      compartments: {
        type: Array,
        required: true
      }
    },
    components: {
      CompartmentLoad
    }
  };
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>Compartments</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p>Compartment N2 loads after the dive.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="compartment-container" v-for="(compartment, index) in compartments">
        <CompartmentLoad :compartment="compartment" :scale="1.2" />
      </v-col>
    </v-row>
  </div>
</template>

<style>
@media (max-width: 600px) {
  .compartment-container {
    width: 12.5%;
    flex: 0 0 auto;
  }
}
</style>
