<script>
import draggable from "vuedraggable";
import WaypointForm from './events/WaypointForm.vue'
import NOTOXForm from './events/NOTOXForm.vue'
import WaypointEvent from './events/WaypointEvent.vue'
import NOTOXEvent from './events/NOTOXEvent.vue'

export default {
  components: {
    draggable,
    WaypointForm,
    NOTOXForm,
    WaypointEvent,
    NOTOXEvent
  },
  data() {
    return {
      eventTypes: ['Waypoint', 'NOTOX'],
      events: [{
        type: 'Waypoint',
        depth: 0,
        duration: 0.000001,
        system: true
      }],
      formEvent: {},
      showEventDialog: false,
      isEditMode: false
    };
  },
  props: {
    gasses: {
      type: Array,
      required: true
    }
  },
  methods: {
    /*
    * Called by the parent component when a gas
    * is removed by the GasManagement component.
    */
    removeGas(gas) {
      this.events
          .map((event, index) => (event.gas === gas ? index : -1))
          .filter(index => index !== -1)
          .sort((a, b) => b - a)
          .forEach(index => this.events.splice(index, 1));
    },
    openNewEventDialog() {
      this.formEvent = {};
      this.isEditMode = false;
      this.showEventDialog = true;
    },
    openEditEvent(event) {
      this.formEvent = {
        type: event.type,
        depth: event.depth,
        duration: event.duration,
        selectedGas: event.gas,
        original: event
      };

      this.isEditMode = true;
      this.showEventDialog = true;
    },
    childForm() {
      return this.formEvent.type === 'Waypoint' ? this.$refs.waypointForm : this.$refs.notoxForm;
    },
    normalizeEventAttributes(event) {
      event.depth = parseInt(event.depth);
      event.duration = parseInt(event.duration);

      /*
      * selectedGas changes with dropdown which means
      * its value can change before user clicks the save
      * button. Therefore, we assign it to actual gas
      * when the user saves the form.
      */
      event.gas = event.selectedGas;
    },
    createEvent() {
      this.childForm().validate(() => {
        this.events.push(this.formEvent);

        this.normalizeEventAttributes(this.formEvent);

        this.showEventDialog = false;

        this.notifyParent();
      });
    },
    updateEvent() {
      this.childForm().validate(() => {
        const event = this.formEvent.original;

        event.depth = this.formEvent.depth;
        event.duration = this.formEvent.duration;
        event.selectedGas = this.formEvent.selectedGas;

        this.normalizeEventAttributes(event);

        this.showEventDialog = false;

        this.notifyParent();
      });
    },
    removeEvent(index) {
      this.events.splice(index, 1);

      this.notifyParent();
    },
    notifyParent() {
      this.$emit('events-updated', this.events);
    },
    previousWaypointFor(index) {
      for(let i = (index - 1); i >= 0; i--) {
        const event = this.events[i];

        if(event.type == 'Waypoint') return event;
      }

      return null;
    }
  }
};
</script>

<template>
  <v-dialog v-model="showEventDialog" max-width="600">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center">
            <h3 v-if="isEditMode">Edit Event</h3>
            <h3 v-else>Add New Event</h3>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-select
          v-model="formEvent.type"
          :items="eventTypes"
          label="Select event type"
          :disabled="isEditMode"
          outlined />

        <WaypointForm
          v-if="formEvent.type === 'Waypoint'"
          ref="waypointForm"
          :formEvent="formEvent"
          :submit="isEditMode ? updateEvent : createEvent" />

        <NOTOXForm
          v-if="formEvent.type === 'NOTOX'"
          ref="notoxForm"
          :formEvent="formEvent"
          :gasses="gasses" />
      </v-card-text>

      <v-card-actions>
        <v-btn text color="primary" @click="isEditMode ? updateEvent() : createEvent()" :disabled="formEvent.type === undefined">Save</v-btn>
        <v-btn text color="secondary" @click="showEventDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-title>
      <v-toolbar class="mb-2" color="primary" dark>
        <v-toolbar-title>Events</v-toolbar-title>
      </v-toolbar>
    </v-card-title>

    <v-card-text class="scrollable-card">
      <draggable v-model="events" @update="notifyParent()">
        <template #item="{element, index}">
          <v-row>
            <WaypointEvent
              v-if="element.type === 'Waypoint' && !element.system"
              :event="element"
              :previousEvent="previousWaypointFor(index)"
              :removeEvent="function() { removeEvent(index) }"
              :openEditEvent="function() { openEditEvent(element) }" />

            <NOTOXEvent
              v-if="element.type === 'NOTOX'"
              :event="element"
              :removeEvent="function() { removeEvent(index) }"
              :openEditEvent="function() { openEditEvent(element) }" />
          </v-row>
        </template>
      </draggable>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="openNewEventDialog()" text="Add event" variant="tonal" color="blue-lighten-2" />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .scrollable-card {
    height:  480px;
    max-height: 480px;
    overflow-y: auto;
  }
</style>
