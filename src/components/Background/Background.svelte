<script lang="ts">
  import { onMount } from "svelte";
  import { getSources } from "./helpers";

  $: src = "";

  onMount(() => {
    getSources().then((sources) => {
      const getRandomIndex = () => Math.floor(Math.random() * sources.length);
      src = sources[getRandomIndex()];
      //Refresh with random image every 20 seconds
      setInterval(() => {
        if (sources.length > 0) {
          src = sources[getRandomIndex()];
        }
      }, 20000);
    });
  });
</script>

{#if src !== ""}
  <img
    alt=""
    src={`${src}=w${window.innerWidth * 2}-h${window.innerHeight * 2}`}
    width="100%"
    height="100%"
  />
{/if}

<!-- todo show a loading spinner initially -->

<style>
  img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    object-position: center;
    object-fit: cover;
  }
</style>
