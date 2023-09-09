<script lang="ts">
  import { Background } from "@components";
  import { login } from "@authentication";
  import { onMount } from "svelte";

  let src = "";

  onMount(async () => {
    login();
  });
</script>

<main>
  <p>Cool shit will go here</p>
  <Background />
</main>

<style>
</style>
