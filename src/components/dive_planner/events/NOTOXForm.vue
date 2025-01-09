<script>
export default {
  props: {
    formEvent: {
      type: Object,
      required: true
    },
    gasses: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      formRules: {
        required: value => !!value || 'This field is required.'
      }
    };
  },
  methods: {
    validate(callback) {
      this.$refs.form.validate().then(isValid => {
        if(!isValid.valid) return;

        callback();
      });
    },
    gasProps(gas) {
      return {
        title: gas.name(),
        subtitle: `O2: ${gas.o2.ratio}%, N2: ${gas.n2.ratio}%`,
        value: gas
      };
    }
  }
}
</script>

<template>
  <v-form ref="form">
    <v-select
      v-model="formEvent.selectedGas"
      :items="gasses"
      :item-props="gasProps"
      :rules="[formRules.required]"
      label="Select Gas"
      outlined />
  </v-form>
</template>
