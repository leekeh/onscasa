<script lang="ts">
  import { Background } from "@components";
  import { initializeGoogleLogin } from "@auth";
  import { onMount } from "svelte";

  let src = "";

  onMount(async () => {
    initializeGoogleLogin();
  });
</script>

<main>
  <p>Cool shit will go here</p>
  <Background />
</main>

<style>
</style>
