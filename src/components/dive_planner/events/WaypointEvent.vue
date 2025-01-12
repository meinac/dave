<script>
import WaypointEventDescription from './waypoint_event/Description.vue'

export default {
  components: {
    WaypointEventDescription
  },
  props: {
    event: {
      type: Object,
      required: true
    },
    previousEvent: {
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
          <v-col md="4" cols="12" style="text-align: left;">Waypoint</v-col>
          <v-col md="8" cols="12">
            <WaypointEventDescription
              :event="event"
              :previousEvent="previousEvent" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
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
