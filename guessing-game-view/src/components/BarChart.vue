<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveData } = mixins
import myApi from "./api"
import { randomColor } from "randomcolor"
import { HubConnectionBuilder } from '@microsoft/signalr'

const initialChartData = async () => {
  const res = await myApi.post('/api/GetDistributionData');
  return res.data;
};

let chartDataPromise = initialChartData();

let _xAxis = [];
let _datasets = {};

const getConnectionInfo = function () {
  return myApi.post('/api/SignalRInfo')
    .then(function(resp) { return resp.data })
    .catch(function() { return {} })
}

const startConnection = function (connection, resolve) {
  console.log('Connecting...')
  connection.start()
    .then(function() { 
      console.log('Connected!');
      resolve();
    })
    .catch(function(err) {
      console.error(err)
      setTimeout(function() { startConnection(connection) }, 2000)
    })
}

const getChartData = function (xAxis, charData) {
    _xAxis = xAxis;
    _datasets = Object.keys(charData).map((key) => {
        return {
            type: 'bar',
            label: key,
            backgroundColor: randomColor({ seed: key }),
            data: charData[key]
        }
    });

    return {
        labels: _xAxis,
        datasets: _datasets
    }
}

const chartRenderSettings = {
  title: {
    display: false,
    text: 'Estimated Toilet Paper Usage by Country/Region'
  },
  scales: {
    yAxes: [{
      stacked: true,
      scaleLabel: {
        display: true,
        labelString: "Number of People"
      }
    }],
    xAxes: [ {
        stacked: true,
        categoryPercentage: 0.5,
        barPercentage: 1,
        scaleLabel: {
          display: true,
          labelString: "Estimated Daily Toilet Paper Usage (squares per day)"
        }
    }]
  },
  legend: {
    display: true
  },
  responsive: true,
  maintainAspectRatio: false
};

export default {
  name: 'BarChart',
  extends: Bar,
  mixins: [reactiveData],
  data () {
    return {
      chartData: {},
      options: chartRenderSettings,
      loading: true,
      error: null
    }
  },
  created () {
    const self = this;
    getConnectionInfo().then((info) => {
      let accessToken = info.accessToken
      const options = {
        accessTokenFactory: function() {
          if (accessToken) {
            const _accessToken = accessToken
            accessToken = null
            return _accessToken
          } else {
            return getConnectionInfo().then(function(info) {
              return info.accessToken
            })
          }
        }
      }

      const connection = new HubConnectionBuilder()
        .withUrl(info.url, options)
        .build()

      const updateChart = function (data) {
        let newValue = Math.ceil(data.squaresPerDay);
        if (newValue > self.chartData.labels.length) {
          // TODO: change size dynamically
          return initialChartData().then((input) => {
            return self.renderFreshChart(input);
          });
        }
        let foundIndex = 0;
        const dataSet = self.chartData.datasets.filter((d, index) => { 
          if (d.label === data.isoCode) {
            foundIndex = index;
          }   
          return d.label === data.isoCode;
        });
        // No match
        if (dataSet.length === 0){
          foundIndex = self.chartData.datasets.length;
          self.chartData.datasets.push({
              type: 'bar',
              label: data.isoCode,
              backgroundColor: randomColor({ seed: data.isoCode }),
              data: new Array(self.chartData.labels.length)
            });
        }
        
        self.chartData.datasets[foundIndex].data[data.squaresPerDay]++;

        self.renderChart(
          self.chartData, 
          self.options
        );
      }

      connection.on('estimateUpdated', updateChart)

      connection.onclose(function() {
        console.log('Disconnected from updates')
        setTimeout(function() { startConnection(connection) }, 2000)
      })
      let connectionResolved;
      const connectionPromise = new Promise(resolve => connectionResolved = resolve);
      startConnection(connection, connectionResolved);
      connectionPromise.then(() => {
        return initialChartData();
      }).then((input) => {
        return this.renderFreshChart(input);
      })
    }).catch(console.error);
  },
  methods: {
    renderFreshChart(input) {  
      let { rawData, isoCodes } = input;
      let max = rawData[0]?.squaresPerDay || 0;
      // let min = rawData[0]?.squaresPerDay || 0;
      for (let i = 1; i < rawData.length; i++) {
          let bucket = rawData[i].squaresPerDay;
          if (bucket > max) max = bucket;
          // if (bucket < min) min = bucket
      }
      max = Math.ceil(max);
      // TODO: just change shape of data
      var xAxis = [];
      var startingData = {};
      for (var i = 0; i <= max + 1; i += 1) {
        xAxis.push(`${i}`);
      }
      for (let isoCode in isoCodes) {
        startingData[isoCode] = new Array(xAxis.length).fill(0);
      }

      for (let data of rawData) {
        let bucketValue = Math.ceil(data.squaresPerDay);
        let previousValue = startingData[data.isoCode][bucketValue];
        startingData[data.isoCode][bucketValue] = previousValue + data.count;
      }
      this.chartData = getChartData(xAxis, startingData);
      this.options.animation = {
        duration: 0
      };
      this.renderChart(
        this.chartData, 
        this.options
      );
    }
  },
  async mounted () {
    let result = await chartDataPromise;
    this.renderFreshChart(result);
  }
}
// vue javascript here
</script>