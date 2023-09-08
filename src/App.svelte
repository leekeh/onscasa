<script lang="ts">
  import { Background } from "@components";
  import { getGoogleAuthToken } from "@auth";
  import { onMount } from "svelte";

  let src = "";

  onMount(async () => {
    getGoogleAuthToken();
  });
</script>

<main>
  <p>Cool shit will go here</p>
  <Background />
</main>

<style>
</style>
