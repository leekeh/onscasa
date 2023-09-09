import { googleToken } from "@auth";

type Data = {
  mediaItems: {
    id: string;
    productUrl: string;
    baseUrl: string;
    mimeType: string;
    mediaMetadata: {
      creationTime: Date;
      width: number;
      height: number;
      photo: {
        cameraMake: string;
        cameraModel: string;
        focalLength: number;
        apertureFNumber: number;
        isoEquivalent: number;
        exposureTime: `${number}s`;
      };
    };
    filename: string;
  }[];
};

export const getSources = async () => {
  const response = await fetch(
    "https://photoslibrary.googleapis.com/v1/mediaItems:search",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${googleToken()}`,
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

  const data: Data = await response.json();
  return data.mediaItems.map((item) => item.baseUrl);
};
