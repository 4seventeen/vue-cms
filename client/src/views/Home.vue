<template>
  <div class="home">
    <h1>Welcome to Vue CMS</h1>
    <p>This is a simple content management system built with Vue.js and Supabase.</p>
    
    <div class="features">
      <h2>Features:</h2>
      <ul>
        <li>User Authentication</li>
        <li>Modern UI</li>
        <li>Responsive Design</li>
        <li>Real-time Database</li>
      </ul>
    </div>
    
    <div class="actions">
      <router-link to="/signup" class="btn">Sign Up</router-link>
      <router-link to="/signin" class="btn">Sign In</router-link>
    </div>
  </div>
</template>

<script setup>
// Home component logic
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

.features {
  margin: 30px 0;
}

.features h2 {
  color: #333;
  margin-bottom: 15px;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 10px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 5px;
  color: #333;
}

.actions {
  margin-top: 30px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.btn:hover {
  background: #0056b3;
}
</style> 