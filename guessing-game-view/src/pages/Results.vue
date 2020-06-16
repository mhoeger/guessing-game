<template>
  <div id="app">
    <h2>Thanks for your submission!</h2>
    <span><i>Your username is: <b>{{ username }}</b></i></span>
    <br>
    <span><i>You probably use <b>{{ squaresPerDay }}</b> squares of toilet paper per day</i></span>
    <Chart />
    <br>
    <Top10 />
    <br><br><br>
  </div>
</template>

<script>
import Top10 from '../components/Top10.vue'
import Chart from "../components/Chart.vue"

export default {
  name: 'Results',
  data() {
    return {
      username: this.$route.query.username || "Anonymous",
      squaresPerDay: this.$route.query.squaresPerDay || "unknown"
    }
  },
  components: {
    Chart,
    Top10
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
