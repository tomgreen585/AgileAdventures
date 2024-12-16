import { SOUND_OPTIONS } from '../common/options.js';
/**
 * @param {Phaser.Scene} scene The Phaser 3 scene to play audio in
 * @param {string} audioKey The key of the audio asset that should be played
 * @returns {void}
 */
export function playBackgroundMusic(scene, audioKey) {
    const existingSounds = scene.sound.getAllPlaying();
    let musicAlreadyPlaying = false;

    existingSounds.forEach((sound) => {
        if (sound.key === audioKey) {
            musicAlreadyPlaying = true;
            return;
        }
        sound.stop();
    });

    if (!musicAlreadyPlaying) {
        scene.sound.play(audioKey, {
            loop: true,
        });
    }
}
