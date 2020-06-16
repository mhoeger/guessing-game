<template>
  <div class="top10">
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h3>Most Accurate Guesses</h3>
      <h5>Users who most accurately guessed the number of toilet paper squares in the picture:</h5>
      <div v-for="(person, index) in post.top10" :key="index" >
        {{ person }}
      </div>
    </div>
  </div>
</template>

<script>
import myApi from "./api"
let loadPromise = myApi.post('/api/GetTop10Closest')
  .then(res => {
    console.log(res.data);
    return res.data;
  })

export default {
  name: 'Top10',
  data() {
    return {
      loading: true,
      post: {
        top10: undefined
      },
      error: null
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
    this.refreshTop10();
  },
  methods: {
    fetchData() {
      loadPromise.then((data) => {
        this.post.top10 = data;
        this.loading = false;
      }).catch((err) => {
        this.error = err;
      })
    },
    refreshTop10() {
      setTimeout(() => {
        myApi.post('/api/GetTop10Closest').then(res => {
          console.log(res.data);
          return res.data;
        }).then((data) => {
          this.post.top10 = data;
          this.loading = false;
        }).catch((err) => {
          this.error = err;
        })
      }, 2000)
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
</style>