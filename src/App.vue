<template>
  <div id="app">
    <Navbar />
    <Banner />
    <div class="container fluid">
    <form>
    <div class="form-group">
      <label  for="exampleFormControlInput1">Activity</label>
      <input v-b-tooltip.lefttop="'This field should include info on the event you plan to spend time on.'" v-model="data.activity" type="text" class="form-control" id="exampleFormControlInput1" placeholder="Rip Genji">
    </div>
    <div class="form-group">
      <label for="exampleFormControlInput1">Task Name</label>
      <input v-b-tooltip.lefttop="'What benefits that areachieved from doing  this activity.'" v-model="data.task" type="text" class="form-control" id="exampleFormControlInput1" placeholder="Genji is my main">
    </div>
    <div class="form-group">
      <label for="exampleFormControlInput1">Time Allocated</label>
      <input v-b-tooltip.lefttop="'How long should you be doing this activity for?'" v-model="data.time" type="time" class="form-control" id="exampleFormControlInput1" placeholder="Genji is the home boy left behind">
    </div>
    <button type="button" @click="addTask" class="btn btn-primary btn-block">Add Task</button>
  </form>
  <br><br><br>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
const Navbar =()=> import('@/components/Navbar.vue'),
      Banner =()=> import('@/components/Banner.vue')
export default {
  name: 'App',
  data: ()=> ({
    data: {
      activity: '',
      task: '',
      time: ''
    }
  }),
  methods: {
    addTask() {
      axios.post('http://localhost:8081/', this.data)
        .then((res) => {
          let { success, data } = res.data
          if(success) {
            alert(JSON.stringify(data))
          }
        })
    }
  },
  components: {
    Navbar, Banner
  }
}
</script>


<style lang="scss">

</style>
