<script>
  export default {
    props: {
      compartment: {
        type: Object,
        required: true
      },
      scale: {
        type: Number,
        default: 2
      }
    },
    computed: {
      loadPercentage() {
        return (this.compartment.loadPercentage() / this.scale) + '%'
      },
      humanizedLoadPercentage() {
        return this.compartment.loadPercentage().toFixed(2);
      },
      progressClass() {
        if(this.compartment.loadPercentage() > 100) {
          return 'bg-red';
        } else if(this.compartment.loadPercentage() > 90) {
          return 'bg-orange';
        } else if(this.compartment.loadPercentage() > 80) {
          return 'bg-lime';
        } else{
          return 'bg-green';
        }
      },
      limitPosition() {
        return (100.0 / this.scale);
      },
      humanizedPPN2() {
        return this.compartment.ppN2.toFixed(3);
      },
      humanizedM1() {
        return this.compartment.m(0).toFixed(3);
      }
    }
  }
</script>

<template>
  <container>
    <div class="v-progress-linear d-flex flex-column-reverse" style="height: 100px;">
      <div :style="{height: loadPercentage}" :class="progressClass"></div>
      <div style="width: 100%; height: 100px; border-top: 1px solid #c8c8c8; position: absolute;" :style="{height: limitPosition + 'px'}"></div>
      <div style="flex: 1" class="v-progress-linear__background bg-green"></div>
      <v-tooltip
        activator="parent"
        location="bottom"
      >
        <p>{{humanizedLoadPercentage}}%</p>
        <p>PPN2: {{humanizedPPN2}}</p>
        <p>M(1): {{humanizedM1}}</p>
      </v-tooltip>
    </div>
    <p>{{this.compartment.name + 1}}</p>
  </container>
</template>
