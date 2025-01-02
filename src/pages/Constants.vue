<script>
import { ASCENT_RATE, DESCENT_RATE } from '../constants/diving'
import { HALF_TIMES, M_VALUES, G_VALUES } from '../constants/buhlmann'
import Environment from '../models/environment'

export default {
  data() {
    return {
      ascentRate: ASCENT_RATE,
      descentRate: DESCENT_RATE,
      waterVapour: Environment.P_H2O // Move this to constants
    }
  },
  computed: {
    tableData() {
      return HALF_TIMES.map((halfTime, i) => {
        return [
          i + 1,
          `${halfTime} mins`,
          M_VALUES[i],
          G_VALUES[i]
        ]
      });
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>Constants</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <h2>General constants</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table>
            <thead>
              <tr>
                <th class="text-center">Name</th>
                <th class="text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ascent Rate</td>
                <td>{{ascentRate}} meters/minute</td>
              </tr>
              <tr>
                <td>Descent Rate</td>
                <td>{{descentRate}} meters/minute</td>
              </tr>
              <tr>
                <td>Water vapour pressure</td>
                <td>{{waterVapour}}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <h2>Buhlmann constants</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table>
            <thead>
              <tr>
                <th class="text-center">Compartment</th>
                <th class="text-center">Half-time</th>
                <th class="text-center">M0(coefficient a)</th>
                <th class="text-center">G(1 / coefficient b)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData">
                <td>{{item[0]}}</td>
                <td>{{item[1]}}</td>
                <td>{{item[2]}}</td>
                <td>{{item[3]}}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
