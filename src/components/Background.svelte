<script lang="ts">
  import { getGoogleAuthToken } from "@auth";
  import { onMount } from "svelte";

  let src = "";

  onMount(async () => {
    const token = await getGoogleAuthToken();

    //TODO switch to axios to type response
    const favoritedPhotos = await fetch(
      "https://photoslibrary.googleapis.com/v1/mediaItems:search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filters: {
            featureFilter: {
              includedFeatures: ["FAVORITES"],
            },
          },
        }),
      }
    );

    src = favoritedPhotos.mediaItems[0].productUrl;

    //TODO create a timeout to rotate the pictures
  });
</script>

<img alt="" {src} width="100%" height="100%" />

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
