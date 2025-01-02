<script>
import N2 from '../models/N2'
import { M_VALUES, G_VALUES } from '../constants/buhlmann'

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, MarkLineComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, MarkLineComponent]);

const depths = Array.from({length: 12}, (_, i) => (i - 1));

export default {
  components: {
    VChart
  },
  data() {
    return {
      selectedCompartment: 0,
      gfHigh: 100,
      gfLow: 100,
      dropdownOptions: Array.from({ length: 16 }, (_, i) => ({ title: `Compartment ${i + 1}`, value: i })),
      chartOptions: {
        title: {
          text: 'M Values'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'value',
          name: 'depth',
          min: -10,
          max: 90
        },
        yAxis: {
          type: 'value',
          name: 'Pressure',
        },
        series: [
          {
            name: 'M(d)',
            type: 'line',
            data: this.generateMValues(0),
            smooth: true,
            lineStyle: {
              color: 'black',
              width: 2
            },
            itemStyle: {
              color: 'black'
            }
          },
          {
            name: 'Ambient Pressure',
            type: 'line',
            data: this.generateAmbientPressureData(),
            smooth: true,
            lineStyle: {
              color: 'blue',
              width: 2
            },
            itemStyle: {
              color: 'blue'
            }
          },
          {
            name: 'PP N2',
            type: 'line',
            data: this.generatePPN2(),
            smooth: true,
            lineStyle: {
              color: 'orange',
              width: 2
            },
            itemStyle: {
              color: 'orange'
            },
            markLine: {
              lineStyle: {
                color: 'red'
              },
              label: {
                show: true,
                formatter: 'supersaturation',
                position: 'middle',
                color: 'red',
                fontSize: 12,
                fontWeight: 'bold'
              },
              data: this.superSaturationMarkLineData(0),
            }
          }
        ],
        grid: {
          show: true,
          borderColor: '#ccc',
          borderWidth: 1,
        }
      }
    }
  },
  methods: {
    generateMValues(compartment) {
      return depths.map((depth) => [((depth - 1) * 10), (M_VALUES[compartment] + depth * G_VALUES[compartment]).toFixed(4)]);
    },
    generateAmbientPressureData() {
      return depths.slice(1).map((depth) => [depth * 10, depth + 1]);
    },
    generatePPN2() {
      return depths.slice(1).map((depth) => [depth * 10, N2.ppAt(depth * 10).toFixed(4)]);
    },
    superSaturationMarkLineData(compartment) {
      const mValues = this.generateMValues(compartment);
      const ppN2 = this.generatePPN2();

      return [[{ xAxis: 70, yAxis: ppN2[7][1]}, { xAxis: 70, yAxis: mValues[9][1]}]];
    },
    updateGFLine() {
      this.chartOptions.series[3] = {
        name: 'GF line',
        type: 'line',
        data: this.generateGFLineData(),
        lineStyle: {
          color: 'green',
          width: 2
        },
        itemStyle: {
          color: 'green'
        },
        markLine: {
          lineStyle: {
            color: 'green'
          },
          label: {
            show: true,
            formatter: 'safety buffer',
            position: 'middle',
            color: 'green',
            fontSize: 12,
            fontWeight: 'bold'
          },
          data: this.GFMarklineData(),
        }
      }
    },
    generateGFLineData() {
      if(this.gfLow == 100 && this.gfHigh == 100) return [];

      const originalMValues = this.generateMValues(this.selectedCompartment);
      const initialAmbientPressure = 10;

      const gfLowPP = (this.gfLow / 100.0) * (originalMValues[11][1] - initialAmbientPressure) + initialAmbientPressure;
      const gfHighPP = (this.gfHigh / 100.0) * (originalMValues[2][1] - 1) + 1;
      const slope = (gfHighPP - gfLowPP) / 90;

      return Array.from({ length: 10 }, (_, i) => [originalMValues[i + 2][0], (gfHighPP - slope * i * 10)]);
    },
    GFMarklineData() {
      if(this.gfLow == 100) return [];

      const gFLineData = this.generateGFLineData();
      const mValues = this.generateMValues(this.selectedCompartment);

      return [[{ xAxis: 80, yAxis: gFLineData[8][1]}, { xAxis: 80, yAxis: mValues[10][1]}]];
    }
  },
  watch: {
    selectedCompartment(newSelectedCompartment) {
      this.chartOptions.series[0].data = this.generateMValues(newSelectedCompartment);
      this.chartOptions.series[2].markLine.data = this.superSaturationMarkLineData(newSelectedCompartment);
      this.updateGFLine();
    },
    gfHigh(newGfHigh) {
      this.updateGFLine();
    },
    gfLow(newGfLow) {
      this.updateGFLine();
    }
  },
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h1>M Values</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">
      <v-select
        v-model="selectedCompartment"
        :items="dropdownOptions"
        label="Select Compartment"
      ></v-select>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="gfHigh"
        label="GF High"
        type="number"
        required
        full-width />
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="gfLow"
        label="GF Low"
        type="number"
        required
        full-width />
    </v-col>
  </v-row>
  <v-row>
    <v-divider />
  </v-row>
  <v-row>
    <v-col cols="12">
      <div style="height: 600px; width: 1000px">
        <v-chart :option="chartOptions" autoresize />
      </div>
    </v-col>
  </v-row>
</template>
