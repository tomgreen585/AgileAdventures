/**
 * @param {String} name The key of the font asset
 * @param {String} url The url to get the font file
 */
export function loadFont(name, url) {
    let newFont = new FontFace(name, `url(${url})`);
    newFont.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        console.log(`${name} font loaded`);
    }).catch((error) => {
        console.error(`Failed to load font: ${name}`, error);
    });
}