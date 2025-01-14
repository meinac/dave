<script>
import GasFactory from '../../factories/gasFactory';

export default {
  data() {
    return {
      sacRate: null,
      decoSacRate: null,
      gasses: [],
      showGasDialog: false,
      isEditMode: false,
      formGas: null,
      startGas: null,
      gasFormRules: {
        required: value => !!value || 'This field is required.',
        numeric: value => !isNaN(parseFloat(value)) || 'Must be a number.',
        range: (min, max) => value => value >= min && value <= max || `Value must be between ${min} and ${max}.`,
        minValue: min => value => value >= min || `Value must be at least ${min}.`
      }
    };
  },
  methods: {
    removeGas(index) {
      this.gasses.splice(index, 1);

      this.$emit('gas-removed', index);
    },
    formGasData() {
      return [
        this.formGas.name,
        parseInt(this.formGas.o2),
        parseInt(this.formGas.volume),
        parseInt(this.formGas.pressure),
        this.formGas.isDeco
      ];
    },
    updateGas() {
      this.validateForm(() => {
        const gas = this.formGas.editing;

        GasFactory.update(gas, ...this.formGasData());

        this.showGasDialog = false;
        this.$emit('gas-updated', gas);
      });
    },
    createGas() {
      this.validateForm(() => {
        const gas = GasFactory.create(...this.formGasData());

        this.gasses.push(gas);
        this.showGasDialog = false;
        this.$emit('gas-added', gas);
      });
    },
    validateForm(callback) {
      const form = this.$refs.gasForm;

      form.validate().then(isValid => {
        if(!isValid.valid) return;

        callback();
      });
    },
    openNewGasDialog() {
      this.formGas = {};
      this.showGasDialog = true;
      this.isEditMode = false;
    },
    openEditGas(gas) {
      this.formGas = {
        name: gas.name(),
        o2: gas.o2.ratio,
        volume: gas.volume,
        pressure: gas.pressure,
        isDeco: gas.deco,
        editing: gas
      };

      this.showGasDialog = true;
      this.isEditMode = true;
    },
    gasProps(gas) {
      return {
        title: gas.name(),
        subtitle: `O2: ${gas.o2.ratio}%, N2: ${gas.n2.ratio}%`,
        value: gas
      };
    }
  },
  watch: {
    sacRate(newValue) {
      this.$emit('sacRate-changed', newValue);
    },
    decoSacRate(newValue) {
      this.$emit('decoSacRate-changed', newValue);
    },
    startGas(newGas) {
      this.$emit('startGas-changed', newGas);
    }
  }
};
</script>

<template>
  <v-dialog v-model="showGasDialog" max-width="600">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center">
            <h3 v-if="isEditMode">Edit Gas</h3>
            <h3 v-else>Add New Gas</h3>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form ref="gasForm" @submit.prevent="isEditMode ? updateGas() : createGas()">
          <v-text-field label="Name" v-model="formGas.name" />
          <v-text-field label="O2 content" v-model="formGas.o2" :rules="[gasFormRules.required, gasFormRules.numeric, gasFormRules.range(1, 100)]" />
          <v-text-field label="Volume" v-model="formGas.volume" :rules="[gasFormRules.required, gasFormRules.numeric, gasFormRules.minValue(1)]" />
          <v-text-field label="Pressure" v-model="formGas.pressure" :rules="[gasFormRules.required, gasFormRules.numeric, gasFormRules.minValue(1)]" />
          <v-switch
            v-model="formGas.isDeco"
            color="primary"
            label="Deco gas"
            hide-details />

          <button type="submit" style="display: none;"></button>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" @click="isEditMode ? updateGas() : createGas()">Save</v-btn>
        <v-btn text color="secondary" @click="showGasDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-title>
      <v-toolbar class="mb-2" color="primary" dark>
        <v-toolbar-title>Gas Management</v-toolbar-title>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col md="6" cols="12">
          <v-text-field label="SAC Rate" v-model="sacRate" type="number" hide-details full-width />
        </v-col>
        <v-col md="6" cols="12">
          <v-text-field label="Deco SAC Rate" v-model="decoSacRate" type="number" hide-details full-width />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="startGas"
            :items="gasses"
            :item-props="gasProps"
            label="Select Start Gas"
            hide-details
            outlined />
        </v-col>
      </v-row>
    </v-card-text>
    <h3>Gasses</h3>
    <v-card-text class="scrollable-card">
      <v-row v-for="(gas, index) in gasses" :key="index">
        <v-col cols="12" :key="index">
          <v-card>
            <v-card-title>
              <h6>{{gas.name()}}<span v-if="gas.deco" class="text-primary">&nbsp;<strong>(D)</strong></span></h6>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="4">O<sub>2</sub>: {{gas.o2.ratio}}%</v-col>
                <v-col cols="4">N<sub>2</sub>: {{gas.n2.ratio}}%</v-col>
                <v-col cols="4"></v-col>
              </v-row>
              <v-row>
                <v-col cols="4">MOD: {{gas.MOD().toFixed(2)}} meters</v-col>
                <v-col cols="4">V: {{gas.volume}} liters</v-col>
                <v-col cols="4">P: {{gas.pressure}} bars</v-col>
              </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn @click="openEditGas(gas)" variant="tonal" color="green-lighten-2">
                <v-icon left>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="removeGas(index)" variant="tonal" color="red-lighten-2">
                <v-icon left>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="openNewGasDialog()" text="Add new gas" variant="tonal" color="blue-lighten-2" />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .scrollable-card {
    height: 300px;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
