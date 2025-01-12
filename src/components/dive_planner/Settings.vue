<script>
export default {
  data() {
    return {
      gfHigh: null,
      gfLow: null,
      autoEndDive: true,
      autoNotox: false
    };
  },
  watch: {
    autoEndDive(newValue) {
      this.$emit('autoEndDive-updated', newValue);
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title>
      <v-toolbar class="mb-2" color="primary" dark>
        <v-toolbar-title>General Settings</v-toolbar-title>
      </v-toolbar>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col md="6" cols="12">
          <v-row>
            <v-col cols="12">
              <h3>Gradient Factors</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" cols="12">
              <v-text-field label="GF High" v-model="gfHigh" type="number" hide-details full-width disabled />
            </v-col>
            <v-col md="6" cols="12">
              <v-text-field label="GF Low" v-model="gfLow" type="number" hide-details full-width disabled />
            </v-col>
          </v-row>
        </v-col>
        <v-divider vertical />
        <v-col md="6" cols="12">
          <v-row>
            <v-col cols="12">
              <h3>Simulation Settings</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" cols="12">
              <v-switch
                v-model="autoEndDive"
                color="primary"
                label="Auto end dive?"
                hide-details />
            </v-col>
            <v-col md="6" cols="12">
              <v-switch
                v-model="autoNotox"
                color="primary"
                label="Auto switch Gas?"
                hide-details
                disabled />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
