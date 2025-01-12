<script>
export default {
  props: {
    event: {
      type: Object,
      required: true
    },
    openEditEvent: {
      type: Function,
      required: true
    },
    removeEvent: {
      type: Function,
      required: true
    }
  }
}
</script>

<template>
  <v-col cols="12">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col md="4" cols="12" style="text-align: left;">NOTOX</v-col>
          <v-col md="8" cols="12">
            <v-icon left>mdi-gas-cylinder</v-icon>
            Switch to {{event.gas.name()}}
            <span v-if="event.gas.deco" class="text-primary"><strong>(Deco Gas)</strong></span>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="openEditEvent(index)" variant="tonal" color="green-lighten-2">
          <v-icon left>mdi-pencil</v-icon>
        </v-btn>

        <v-btn @click="removeEvent(index)" variant="tonal" color="red-lighten-2">
          <v-icon left>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
