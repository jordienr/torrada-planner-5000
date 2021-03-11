<template>
  <div class="home">
    <h1>Puig de Sta. Magdalena</h1>
    <div class="divider"></div>
    <section id="participants">
      <h2>Participantes</h2>
      <p>Conectad@ como: {{ currentUser }}</p>
      <div id="user" v-for="user in users" :key="user.name">
        <div class="user-ball">{{ user.substring(0,2) }}</div>
        {{ user }}
      </div>
    </section>

    <div class="divider"></div>
    <section id="tasks">
      <h2>Tareas</h2>
      <p>Haz click en una tarea para asignártela</p>
      <div class="task" v-for="(task, index) in tasks" :key="index" @click.stop="askToAcceptTask(task)">
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
            <button @click.stop="askToAcceptTask({name: ''})">Cancelar</button>
          </div>
        </div>
        <div v-else>
          <p class="task-name">{{ task.task }}</p>
          <p class="task-user">{{ task.user}}</p>
        </div>
      </div>
      <div class="new-task">
        <input type="text" v-model="newTask">
        <button @click="addNewTask">+ Añadir</button>
      </div>
    </section>
    <div v-if="!currentUser" class="set-username-form">
      <h1>¿Cómo te llamas?</h1>
      <div class="form">
        <input type="text" v-model="username">
        <button @click="setUsername">Entrar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { rtdb } from '@/firebase'
import Vue from 'vue';
import { v4 as getId } from 'uuid';

export default Vue.extend({
  name: 'Home',
  data: () => ({
    tasks: [],
    users: [],
    test: 'asd',
    currentUser: undefined,
    username: "",
    taskToAccept: { task: '' },
    newTask: ""
  }),
  methods: {
    setUsername() {
      this.currentUser = this.username
      rtdb.ref('users/' + this.username).set(this.username)
      window.localStorage.setItem('username', this.username)
    },
    askToAcceptTask(task) {
      this.taskToAccept = task
    },
    acceptTask(task) {
        const taskRef = rtdb.ref('tasks/' + task.id)
        taskRef.update({ "user": this.currentUser })
        console.log(this.currentUser)
        this.askToAcceptTask({name: ''})
    },
    deleteTask(task) {
      rtdb.ref('tasks/' + task.id).remove()
    },
    addNewTask() {
      console.log(this.newTask)
      rtdb.ref('tasks/' + getId()).set({
        task: this.newTask
      })
    }
  },
  mounted() {
    
    const username = window.localStorage.getItem('username')
    if (username) {
      this.currentUser = username
    }

    const tasksRef = rtdb.ref('tasks')
    const usersRef = rtdb.ref('users')

    tasksRef.on('value', (snapshot) => {
      const tasks = []

      snapshot.forEach(item => {
        tasks.push({
          id: item.key,
          task: item.val().task,
          user: item.val().user
        })
      })

      this.tasks = tasks
    })

    usersRef.on('value', snapshot => {
      this.users = snapshot.val()
    })


    
  }
});
</script>

<style scoped lang="scss">
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #242427;
  font-size: 14px;
}
h1 {
  font-size: 1.5rem;
}

.home {
  margin-bottom: 4rem;
}

.task {
  padding: .7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: .4rem;
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
  input, button {
    border-radius: 8px;
    margin: .25rem;
    border: 1px solid #ddd;
    padding: .5rem;
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
      margin: .25rem;
      padding: .5rem;
      min-width: 44px;
      border: 1px solid #ddd;
      border-radius: .5rem;
      background: none;
    }
  }
}

#user {
  display: inline-block;
  text-align: center;
  color: rgb(148, 148, 148);
  margin: .25rem;
  .user-ball {
    height: 32px;
    width: 32px;
    background-color: rgb(50, 87, 211);
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
    padding: .5rem;
    display: block;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  button {
    padding: .5rem;
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
</style>
