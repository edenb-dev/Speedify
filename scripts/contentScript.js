/// TODO make v1 public and add to git hub.
/// change error messages to display on another seprate screen.
/// add to the other display controllers/menu if failed to load locate a place to put the button .


window.addEventListener('load', onLoad, false);


/**
 * Initializes the playback speed controller upon the page load.
 */
 
function onLoad() {
	
	if (!isSpotifyLoadedSuccessfully()) {
		
		this.attempt_SpotifyLoadedSuccessfully = ( this.attempt_SpotifyLoadedSuccessfully ?? 0 ) + 1;
		
		
		if (this.attempt_SpotifyLoadedSuccessfully == 5) {
			console.debug('Speedify - Debug Info: Spotify did not load properly. ( User Action Required )\n\nPlease try reloading the page.');
			return;
		}
		
		setTimeout(() => { onLoad(); }, 3000);
		return;
	}
	
	if (!isPlayerControlPanelPresent()) {
	
		console.debug('Speedify - Critical Error: Unable to locate Spotify\'s control panel element. ( User Action Required )\n\nPlease try reloading the page. If the issue persists, rest assured an update to the extension will be arriving soon, expected within the next 24 hours. For any other concerns or inquiries regarding the extension, please don\'t hesitate to contact us via email. You can find our email address on the extension\'s page.');
		return;
	}
	
	initializeController();
}

/**
 * Checks if Spotify has loaded successfully by verifying the presence of the nav menu.
 *
 * @returns {boolean} Returns true if Spotify has loaded successfully; otherwise, returns false.
 */

function isSpotifyLoadedSuccessfully() {
	
	const navMenu = document.querySelector("body nav");
	
	return (navMenu !== null);
}

/**
 * Checks if the control panel element in Spotify's player interface is missing.
 *
 * @returns {boolean} True if the control panel element is missing, otherwise false.
 */

function isPlayerControlPanelPresent() {
	
	const playerControlPanel = document.querySelector('div[data-testid="player-controls"] div > div');
	
	return (playerControlPanel !== null);
}

/**
 * Initializes the playback speed controller.
 * Creates instances of PlaybackSpeedController and MenuHandler to manage playback speed functionalities.
 * Adds a playback speed button and toggle menu functionality.
 */

function initializeController() {
	
	const playerControlPanel = document.querySelector('div[data-testid="player-controls"] div > div');
	
	const playbackSpeedController = new PlaybackSpeedController(playerControlPanel);
	const menuHandler = new MenuHandler(playerControlPanel, playbackSpeedController);
	
	playbackSpeedController.createPlaybackBtn(menuHandler.toggleMenu.bind(menuHandler));
}