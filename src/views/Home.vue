<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <todo></todo>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
// @ is an alias to /src
import Todo from "@/components/Todo/index.vue";

// Declare component
@Component({
  name: "Home",
  components: {
    Todo
  }
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.home {
  padding-bottom: 4rem;
}
</style>
