<template>
  <div class="submit">
  <br><br>
  <form @submit.prevent="">
    <span>How many squares of toilet paper do you think there are in this picture?    </span>
    <input v-model="squareEstimate" placeholder="enter number">
    <br><br>
    <span>How many days would this supply last you?    </span>
    <input v-model="dayEstimate" placeholder="enter number">
    <br><br>
    <button @click="submit()">
      Submit Guess
    </button>
    <br><br>
    <span><b>{{ errorMessage }}</b></span>
  </form>
  </div>
</template>

<script>
import myApi from "./api"
const usernamePromise = myApi.post('/api/GetSessionName')
  .then(res => {
      return res.data;
  })
  .catch(err => {
    console.error(err);
  });

export default {
  name: 'SubmitEstimate',
  props: {
    msg: String
  },
  data() {
    return {
      errorMessage: "",
      squareEstimate: "",
      dayEstimate: ""
    }
  },
  methods: {
    submit() {
      usernamePromise.then((username) => {
        const roundedSquaresPerDay = Math.ceil(Math.ceil(parseInt(this.squareEstimate)) / Math.ceil(parseInt(this.dayEstimate)));
        return myApi.post('/api/MakeEstimate', null, { params: {
            squareEstimate: this.squareEstimate || 0,
            dayEstimate: this.dayEstimate || 0,
            username,
            squaresPerDay: roundedSquaresPerDay
          }
        })
        .then(() => {
            this.$router.push(`/results?username=${username}&squaresPerDay=${roundedSquaresPerDay}`);
        })
        .catch(err => {
          let res = err.response;
          if (res.status == 400) {
            this.errorMessage = res.data;
          }
          console.error(err.response);
        });
      }) 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
