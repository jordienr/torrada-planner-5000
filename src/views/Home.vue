<template>
  <div class="home">
    <div class="title">
      <input type="text" v-model="title" />
    </div>
    <div class="tasks-container">
      <div class="task" v-for="(task, index) in tasks" :key="index">
        {{ task.task }}
        <button @click="deleteTask(task.id, task.task)">🗑</button>
      </div>
    </div>
    <div class="new-task">
      <input type="text" v-model="newTask" />
      <button @click="saveNewTask">Save</button>
    </div>
  </div>
</template>

<script>
import { rtdb } from "@/firebase";
import Vue from "vue";
const tasksRef = rtdb.ref("tasks");
const titleRef = rtdb.ref("title");

export default Vue.extend({
  name: "Home",
  data: () => ({
    tasks: [],
    newTask: "",
    title: "",
    showDeleteConfirmation: false,
  }),
  computed: {},
  methods: {
    saveNewTask() {
      this.$confetti.start();
      const now = Date.now();
      rtdb.ref("tasks/" + now).set({
        task: this.newTask,
        id: now,
      });
      this.newTask = "";

      setTimeout(() => {
        this.$confetti.stop();
      }, 1000);
    },
    deleteTask(id, task) {
      if (window.confirm("Seguro que quieres borrar " + task + "?")) {
        rtdb.ref("tasks/" + id).remove();
      }
    },
  },
  mounted() {
    tasksRef.on("value", (snapshot) => {
      this.tasks = snapshot.val();
    });
    titleRef.on("value", (snapshot) => {
      this.title = snapshot.val();
    });
  },
  watch: {
    title() {
      titleRef.set(this.title);
    },
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");

body {
  font-size: 15px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  padding: 0;
  margin: 0;
}
* {
  box-sizing: border-box;
}
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.title {
  padding: 1rem;
  border-bottom: 1px solid #eaeaea;
  input {
    border: none;
    font-size: 24px;
    font-weight: bold;

    margin: 0;
  }
}
.tasks-container {
  overflow-y: auto;
  flex-grow: 1;

  .task {
    padding: 1rem;
    border-bottom: 1px solid #eaeaea;
    display: flex;
    justify-content: space-between;
    button {
      border: none;
      background: none;
      font-size: 22px;
    }
  }
}
.new-task {
  padding: 1rem;
  display: flex;
  margin-bottom: 4rem;
  border-top: 1px solid #eaeaea;
  input,
  button {
    height: 40px;
    padding: 0.5rem;
    border-radius: 5px;
    border: none;
  }
  input {
    flex-grow: 1;
    border: 1px solid #eaeaea;
    margin-right: 1rem;
  }
  button {
    font-weight: bold;
    background: lightblue;
    min-width: 80px;
  }
}
</style>
