<script>
export default {
  props: {
    formEvent: {
      type: Object,
      required: true
    },
    submit: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      formRules: {
        required: value => !!value || 'This field is required.',
        numeric: value => !isNaN(parseFloat(value)) || 'Must be a number.',
        minValue: min => value => value >= min || `Value must be at least ${min}.`
      }
    };
  },
  methods: {
    validate(callback) {
      this.$refs.form.validate().then(isValid => {
        if(!isValid.valid) return;

        callback();
      });
    }
  }
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit()">
    <v-text-field
      v-model="formEvent.depth"
      label="Depth"
      type="number"
      :rules="[formRules.required, formRules.numeric, formRules.minValue(0)]" />

    <v-text-field
      v-model="formEvent.duration"
      label="Duration"
      type="number"
      :rules="[formRules.required, formRules.numeric, formRules.minValue(1)]" />

    <button type="submit" style="display: none;"></button>
  </v-form>
</template>
