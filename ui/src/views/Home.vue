<template>
  <div id="home">
    <URLDataFetch />
  </div>
</template>

<style scoped>
#home {
  width: 100vw;
  height: 100vh;
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import URLDataFetch from "@/components/URLDataFetch.vue"; // @ is an alias to /src

@Options({
  components: {
    URLDataFetch,
  },
})
export default class Home extends Vue {}
</script>
