<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import VChart from 'vue-echarts';

import Tooltip from './dive_profile/Tooltip.vue'
import ComponentRenderer from '../../utils/component_renderer';

use([CanvasRenderer, LineChart, ScatterChart, GridComponent, TooltipComponent, TitleComponent]);

export default {
  components: {
    VChart
  },
  props: {
    dive: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        tooltip: {
          trigger: 'axis',
          formatter: (data) => {
            const renderer = new ComponentRenderer(Tooltip);

            return renderer.render({ data: data });
          }
        },
        xAxis: {
          type: 'value',
          name: 'time',
          min: 0,
          max: 10,
          axisLine: {
            onZero: false
          },
          axisLabel: {
            formatter: function(value, _) {
              return `${value} mins`;
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'depth',
          inverse: true,
          min: 0,
          max: 10,
          axisLabel: {
            formatter: function(value, _) {
              if(value === 0) return 'Surface';

              return `${value} meters`;
            }
          }
        },
        series: [
          {
            name: 'Dive Profile',
            type: 'line',
            data: [],
            smooth: false,
            lineStyle: {
              color: 'black',
              width: 2
            },
            itemStyle: {
              color: 'black'
            }
          },
          {
            name: 'Deco ceiling',
            type: 'line',
            smooth: false,
            areaStyle: {
              color: 'red'
            },
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            data: []
          },
          {
            name: 'Alert',
            type: 'scatter',
            symbolSize: 20
          }
        ]
      }
    };
  },
  beforeMount() {
    const diveProfile = [];
    const decoStops = [];
    const events = [];

    this.dive.history.forEach(history => {
      if(history.type === 'Waypoint') {
        diveProfile.push({
          value: [history.time, history.depth],
          TTS: history.TTS,
          extra: history.extra
        });
      } else {
        events.push({
          value: [history.time, history.depth],
          type: history.type,
          extra: history.extra
        });
      }
    });

    let lastDecoStop = null;

    this.dive.decoStops.forEach(decoStop => {
      if(lastDecoStop !== decoStop.depth && lastDecoStop !== null)
        decoStops.push([decoStop.time, lastDecoStop]);

      decoStops.push([decoStop.time, decoStop.depth]);

      lastDecoStop = decoStop.depth;
    });

    this.chartOptions.series[0].data = diveProfile;
    this.chartOptions.series[1].data = decoStops;
    this.chartOptions.series[2].data = events;

    this.chartOptions.xAxis.max = this.dive.time + 5;
    this.chartOptions.yAxis.max = this.dive.maxDepth + 10;
  }
}
</script>

<template>
  <div style="height: 600px">
    <v-chart :option="chartOptions" autoresize />
  </div>
</template>
