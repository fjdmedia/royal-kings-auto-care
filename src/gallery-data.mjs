/* Populated by build.mjs from the assets/Gallery/ scan BEFORE any page
   module is imported. Pages read it as plain data, so a page never has to
   know how photos get discovered. */
export const GALLERY = { pairs: [], shots: [], services: {}, jobs: [], hasPhotos: false };
export function setGallery(g) { Object.assign(GALLERY, g); }
