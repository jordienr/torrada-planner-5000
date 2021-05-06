<template>
  <div class="set-username-form">
    <h1>¿Cómo te llamas?</h1>
    <div class="form">
      <form>
        <input type="text" v-model="username" />
        <button @click="login">Entrar</button>
      </form>
    </div>
  </div></template
>

<script>
import { rtdb } from "@/firebase";

export default {
  data: () => ({
    username: "",
  }),
  methods: {
    login() {
      window.localStorage.setItem("username", this.username);
      rtdb
        .ref("users/" + this.username)
        .set({ name: this.username, attendance: false });
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
