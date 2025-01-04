<script>
export default {
  props: {
    full: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    textAlign() {
      return this.full ? 'left' : 'center';
    }
  }
}
</script>

<template>
  <v-container class="bg-red-lighten-1 pa-6">
    <v-row>
      <v-col cols="12">
        <h3>Disclaimer</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4>Important Safety Notice</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p :style='`text-align: ${textAlign};`'>
          This dive planner application is intended for <strong>educational and informational purposes only</strong>. It is not a substitute for professional dive training, certification, or the use of industry-standard tools and practices. Using this application to plan your dives comes with inherent risks and should not replace your personal judgment, training, or consultations with certified dive professionals.
        </p>
      </v-col>
    </v-row>
    <v-row v-if="full">
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h4>Use at Your Own Risk</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p :style='`text-align: ${textAlign};`'>
              Scuba diving is an activity that involves significant risks, including but not limited to decompression sickness, oxygen toxicity, equipment failure, and other life-threatening conditions. This application is provided “as is,” without any guarantees of accuracy, completeness, or reliability. The creators, contributors, and maintainers of this application do not assume responsibility for any errors, omissions, or consequences resulting from its use.
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols=12>
            <h4>Your Responsibility</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p :style='`text-align: ${textAlign};`'>
              Before attempting any dive:
            </p>
            <p :style='`text-align: ${textAlign};`'>
              1) Ensure you have the proper training, certification, and experience for the planned dive.<br/>
              2) Use verified and reliable dive planning tools as your primary resource.<br/>
              3) Conduct thorough pre-dive safety checks and follow all established diving protocols.<br/>
            </p>
            <br/>
            <p :style='`text-align: ${textAlign};`'>
              This application is designed to <strong>support your understanding of dive planning concepts</strong> but <strong>must not</strong> be relied upon for planning real-world dives.
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h4>Acknowledgement of Risk</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p :style='`text-align: ${textAlign};`'>
              By using this application, you acknowledge and accept the risks associated with scuba diving and the use of this tool. You agree to hold the creators and contributors harmless from any liability, including injury, loss, or damage that may result from using this application.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
