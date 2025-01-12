<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import VChart from 'vue-echarts';

import Time from '../../utils/time'

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
  setup() {
    use([ScatterChart]);
  },
  data() {
    return {
      chartOptions: {
        tooltip: {
          trigger: 'axis',
          formatter: function(data) {
            const time = Time.humanizeMinutes(data[0].value[0]);
            let tooltipContent = `${time}<br/><br/>`;
            let lastCeiling = null;

            data.forEach(item => {
              if(item.seriesName === 'Dive Profile') {
                tooltipContent += `${item.marker} Depth: <b>${item.value[1].toFixed(2)} meters</b><br/>`;
              } else if(item.seriesName === 'Deco ceiling') {
                const indexOfOther = data.findIndex(i => i.seriesName === 'Deco ceiling' && i.data[1] > item.data[1]);

                if(indexOfOther < 0 && lastCeiling === null) {
                  lastCeiling = item.value[1];
                  tooltipContent += `${item.marker} Deco Ceiling: <b>${item.value[1]} meters</b><br/>`;
                }
              } else if(item.seriesName === 'Alert') {
                if(item.data.type === 'NOTOX') {
                  tooltipContent += `${item.marker} NOTOX ${item.data.extra.name}</b><br/>`;
                }
                // Add more alerts to here.
              }
            });

            return tooltipContent;
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
        diveProfile.push([history.time, history.depth]);
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
