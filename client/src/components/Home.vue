   <template>
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home page!</p>
      <button @click="navigateToSignup" class="signup-btn">Signup</button>
      <button @click="navigateToSignin" class="signin-btn">Signin</button>
    </div>
  </template>

  <script>
  export default {
    name: "Home",
    methods: {
      navigateToSignup() {
        this.$router.push("/signup");
      },
      navigateToSignin() {
        this.$router.push("/signin");
      },
    },
  };
</script>

<style scoped>
.signup-btn {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5em 1.5em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
  margin-right: 10px;
}
.signup-btn:hover {
  background-color: #222;
}

.signin-btn {
  background-color: #1976d2;
  color: #fff;
  border: none;
  padding: 0.5em 1.5em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.signin-btn:hover {
  background-color: #1565c0;
}
</style>