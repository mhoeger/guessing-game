<template>
  <div class="chart">
    <h2>Estimated Toilet Paper Consumption by Country/Region</h2>
    <BarChart />
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script src='https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'></script>
<script>
import myApi from "./api"
import BarChart from "./BarChart"

let chartDataPromise = myApi.post('/api/GetDistributionData')
  .then(res => {
    console.log(res.data);
    return res.data;
  })

export default {
  name: 'Chart',
  components: {
      BarChart
  },
  data() {
    return {
      loading: true,
      post: {
        chartData: undefined
      },
      error: null
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  methods: {
    fetchData() {
      chartDataPromise.then((data) => {
        this.post.chartData = data;
        this.loading = false;
      }).catch((err) => {
        this.error = err.response;
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}


.chart-container{
    padding:25px;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

</style>