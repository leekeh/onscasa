<script lang="ts">
  import { Background } from "@components";
  import {
    loginIntoGoogleAccount,
    isLoggedIntoGoogleAccount,
    processGoogleAccountLogin,
  } from "@auth";
  import { onMount } from "svelte";

  onMount(async () => {
    processGoogleAccountLogin();
  });

  $: isLoggedIn = isLoggedIntoGoogleAccount();
</script>

<main>
  {#if isLoggedIn}
    <Background />
  {:else}
    <p>You are currently logged out :(</p>
    <button on:click={loginIntoGoogleAccount}>Login</button>
  {/if}
</main>

<style>
</style>
