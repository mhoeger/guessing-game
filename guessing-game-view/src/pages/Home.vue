
<template>
  <div id="app">
    <img alt="Vue logo" src="../assets/my-tp.png" style="width: 40%">
    <Submit />
  </div>
</template>

<script>
import Submit from '../components/Submit.vue'

export default {
  name: 'Home',
  components: {
    Submit
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
