<template>
  <div class="home">
    <div @click="changePlanTitle">
      <h1>{{ meta.planTitle }}</h1>
    </div>
    <div class="divider"></div>
    <section id="participants">
      <h2>Participantes</h2>
      <p>Conectad@ como: {{ currentUser.name }}</p>
      <div id="user" v-for="user in users" :key="user.name">
        <div
          class="user-ball"
          :class="{
            'current-user-ball': user.name === currentUser,
            'will-attend': user.attendance,
          }"
        >
          {{ user.name.substring(0, 2) }}
        </div>
        {{ user.name }}
      </div>
    </section>

    <section class="asistiras">
      <h2>¿Asistirás?</h2>
      <div>
        <button @click="setAttendance(true)">Si</button>
        <button @click="setAttendance(false)">No</button>
      </div>
    </section>

    <div class="divider"></div>
    <section id="tasks">
      <h2>Tareas</h2>
      <p>Haz click en una tarea para asignártela</p>
      <div
        class="task"
        v-for="(task, index) in tasks"
        :key="index"
        @click.stop="askToAcceptTask(task)"
      >
        <div v-if="taskToAccept.task === task.task" class="ask-to-accept">
          <div>
            <small>{{ task.task }}</small>
            <p>
              ¿Qué quieres hacer?
            </p>
          </div>
          <div class="actions">
            <button @click.stop="acceptTask(task)">✌ Asignarme tarea</button>
            <button @click.stop="deleteTask(task)">🗑 Borrar tarea</button>
            <button @click.stop="askToAcceptTask({ name: '' })">
              Cancelar
            </button>
          </div>
        </div>
        <div v-else>
          <p class="task-name">{{ task.task }}</p>
          <p class="task-user">{{ task.user }}</p>
        </div>
      </div>
      <div class="new-task">
        <input type="text" v-model="newTask" />
        <button @click="addNewTask">+ Añadir</button>
      </div>

      <div>
        <button @click="logout">
          😒 Salir
        </button>
      </div>
    </section>

    <section class="debug">
      <div v-for="user in users" :key="user.name">
        <span>{{ user.name }}</span>
        <button @click="deleteUser(user.name)">deleteUser</button>
      </div>
    </section>
  </div>
</template>

<script>
import { rtdb } from "@/firebase";
import Vue from "vue";
import { v4 as getId } from "uuid";

export default Vue.extend({
  name: "Home",
  data: () => ({
    tasks: [],
    users: [],
    meta: {
      planTitle: "",
    },
    test: "asd",
    taskToAccept: { task: "" },
    newTask: "",
    showLogin: true,
    currentUser: {},
  }),
  computed: {
    username() {
      return window.localStorage.getItem("username");
    },
    isDebugMode() {
      return this.$route.params.debug;
    },
  },
  methods: {
    deleteUser(name) {
      rtdb.ref("users/" + name).remove();
    },
    setUsername() {
      this.currentUser.name = this.username;
      rtdb.ref("users/" + this.username).update({ name: this.username });
      window.localStorage.setItem("username", this.username);
    },
    askToAcceptTask(task) {
      this.taskToAccept = task;
    },
    acceptTask(task) {
      const taskRef = rtdb.ref("tasks/" + task.id);
      taskRef.update({ user: this.currentUser });
      this.askToAcceptTask({ name: "" });
    },
    deleteTask(task) {
      rtdb.ref("tasks/" + task.id).remove();
    },
    addNewTask() {
      rtdb.ref("tasks/" + getId()).set({
        task: this.newTask,
      });
    },
    changePlanTitle() {
      const newTitle = window.prompt("¿Qué título le quieres poner al plan?");
      if (newTitle) {
        rtdb.ref("meta").set({
          planTitle: newTitle,
        });
      }
    },
    setAttendance(val) {
      rtdb.ref("users/" + this.currentUser.name).update({
        attendance: val,
      });
    },
    logout() {
      this.currentUser = {};
      this.username = undefined;
      window.localStorage.removeItem("username");
      this.$router.push("/login");
    },
  },
  async mounted() {
    const tasksRef = rtdb.ref("tasks");
    const usersRef = rtdb.ref("users");
    const metaRef = rtdb.ref("meta");
    const username = window.localStorage.getItem("username");

    if (!username) {
      this.$router.push("/login");
    }

    const currentUserRef = rtdb.ref("users/" + username);

    currentUserRef.on("value", (snapshot) => {
      this.currentUser = snapshot.val();
    });

    tasksRef.on("value", (snapshot) => {
      const tasks = [];

      snapshot.forEach((item) => {
        tasks.push({
          id: item.key,
          task: item.val().task,
          user: item.val().user.name,
        });
      });

      this.tasks = tasks;
    });

    usersRef.on("value", (snapshot) => {
      this.users = snapshot.val();
    });

    metaRef.on("value", (snapshot) => {
      this.meta = snapshot.val();
    });
  },
});
</script>

<style lang="scss">
* {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: #242427;
  font-size: 14px;
}
body {
  max-width: 340px;
  margin: auto;
}
h1 {
  font-size: 1.5rem;
}

.home {
  margin-bottom: 4rem;
}

.current-user-ball {
  box-shadow: 0 0 0 2px rgb(0, 0, 0);
}

.will-attend {
  background: rgb(36, 177, 36) !important;
}

.task {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0.4rem;
  .task-name {
    font-weight: 700;
    text-transform: capitalize;
    font-size: 16px;
    margin: 0;
  }
  .task-user {
    margin: 0;
  }
}

.new-task {
  padding: 1rem;
  display: flex;
  input {
    flex-grow: 1;
  }
  input,
  button {
    border-radius: 8px;
    margin: 0.25rem;
    border: 1px solid #ddd;
    padding: 0.5rem;
  }
}

.ask-to-accept {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  small {
    font-size: 12px;
    font-weight: 400;
  }
  .actions {
    button {
      margin: 0.25rem;
      padding: 0.5rem;
      min-width: 44px;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background: none;
    }
  }
}

#user {
  display: inline-block;
  text-align: center;
  color: rgb(148, 148, 148);
  margin: 0.25rem;
  .user-ball {
    height: 32px;
    width: 32px;
    background-color: rgb(241, 18, 18);
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    color: white;
    font-weight: 900;
    border-radius: 8px;
  }
}

.divider {
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 1px;
  background-color: #ddd;
}

.set-username-form {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10rem;
  .form {
    display: flex;
    flex-direction: column;
  }
  input {
    padding: 0.5rem;
    display: block;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  button {
    padding: 0.5rem;
    background-color: rgb(0, 13, 130);
    border: none;
    border-radius: 8px;
    color: white;
    margin-top: 1rem;
    font-weight: 500;
    letter-spacing: 1px;
    font-size: 1rem;
  }
}

.asistiras {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0.5rem;
    border-radius: 0.5rem;
    width: 44px;
    margin: 0.25rem;
    border: none;
  }
}

.debug {
  margin-top: 100px;
  div {
    margin-top: 1rem;
  }
}
</style>
