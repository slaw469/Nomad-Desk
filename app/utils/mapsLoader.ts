// app/utils/mapsLoader.ts

let googleMapsPromise: Promise<void> | null = null;

/**
 * Load the Google Maps JavaScript API
 * @param apiKey Google Maps API key
 * @param libraries Optional array of libraries to load (e.g., ['places', 'geometry'])
 * @returns Promise that resolves when the API is loaded
 */
export const loadGoogleMapsApi = (apiKey: string, libraries: string[] = []): Promise<void> => {
  // If we already have a promise to load Google Maps, return it
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // If Google Maps is already loaded, resolve immediately
  if (window.google && window.google.maps) {
    googleMapsPromise = Promise.resolve();
    return googleMapsPromise;
  }

  // Create a new promise to load Google Maps
  googleMapsPromise = new Promise<void>((resolve, reject) => {
    // Add a global callback function
    const callbackName = 'googleMapsInitCallback';
    window[callbackName] = () => {
      resolve();
      // Clean up
      delete window[callbackName];
    };

    // Create the script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&libraries=${libraries.join(',')}`;
    script.async = true;
    script.defer = true;

    // Handle errors
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
      // Clean up
      delete window[callbackName];
    };

    // Append the script to the document
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

/**
 * Get the Google Maps API instance
 * @returns The Google Maps API namespace
 * @throws Error if the API is not loaded
 */
export const getGoogleMapsApi = (): typeof google.maps => {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps API is not loaded. Call loadGoogleMapsApi first.');
  }
  return window.google.maps;
};

/**
 * Check if the Google Maps API is loaded
 * @returns True if the API is loaded, false otherwise
 */
export const isGoogleMapsApiLoaded = (): boolean => !!window.google && !!window.google.maps;

// Declare global Google Maps types
declare global {
  interface Window {
    google: typeof google;
    [key: string]: any; // For the callback function
  }
}
