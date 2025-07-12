import { useEffect, useState } from "react";

/**
 * Fetch up to two high-res photo URLs for a given Google Places `placeId`.
 * Falls back to an empty array if the Places JS API isn’t available or returns no photos.
 */
export default function usePlacePhotos(placeId) {
  const [photoUrls, setPhotoUrls]   = useState([]);   // jpeg/png URLs returned by `.getUrl()`
  const [photoRefs, setPhotoRefs]   = useState([]);   // raw photo reference strings
  const [error,     setError]       = useState(null);

  useEffect(() => {
    if (!placeId || !(window.google?.maps?.places)) {
      // Either no destination yet or Places JS API hasn't loaded
      setPhotoUrls([]);
      setPhotoRefs([]);
      return;
    }

    const svc = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    svc.getDetails({ placeId, fields: ["photos"] }, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        Array.isArray(place?.photos) &&
        place.photos.length
      ) {
        const firstTwo = place.photos.slice(0, 2);

        // Ask the Photo API for something reasonably large; Google will down-scale if needed.
        const urls = firstTwo.map((p) =>
          p.getUrl({ maxWidth: 1200, maxHeight: 1200 })
        );
        const refs = firstTwo.map((p) => p.photo_reference);

        setPhotoUrls(urls);
        setPhotoRefs(refs);
      } else {
        setError(`Places PhotoService status: ${status}`);
        setPhotoUrls([]);
        setPhotoRefs([]);
      }
    });
  }, [placeId]);

  return { photoUrls, photoRefs, error };
}
