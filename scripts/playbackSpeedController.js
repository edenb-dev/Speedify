/**
 * Represents a controller for managing playback speed.
 * @class
 */
 
class PlaybackSpeedController {
 	
    /**
     * Creates a PlaybackSpeedController.
     * @constructor
     *
     * @param {HTMLElement} controllerContainer - The HTML element where the playback speed button will be added.
     */
    
    constructor(controllerContainer) {
    	
    	/**
         * Settings for the playback speed controller.
         * @type {object}
         */
        
        this.settings = {
        	
        	playback: {	minSpeed: 0.5,
			            maxSpeed: 3.5,
			            interval: 0.1,
			            defaultSpeed: 1},
            
            syncPlaybackSpeedWithLocalStorage: true
        };
        
        /**
		 * Error logger object to track and manage errors.
		 * @type {object}
		 */
         
		this.errorLogger = {}
        
        // Reference to the HTML element where the playback speed button will be added.
        this.controllerContainer = controllerContainer;
        
        // Checks if the sync with local storage setting is disabled, sets the default speed accordingly.
        if (!this.settings.syncPlaybackSpeedWithLocalStorage)
        	this.setPlaybackSpeed(this.settings.defaultSpeed);
        
        // Initializes monitoring for media element additions and playback speed changes.
        this.initializeMediaElementsMonitoring();
	}
	
	/**
	 * Retrieves the playback speed from local storage.
	 *
	 * @returns {number} The playback speed value.
	 */
	
	getPlaybackSpeed() {
		
		try {
		    var playbackSpeed = localStorage.getItem('playbackSpeed');
		    
		    if(playbackSpeed !== null && this.validPlaybackSpeed(playbackSpeed))
		        return Math.round(parseFloat(playbackSpeed) * 10) / 10;
		    
		    this.setPlaybackSpeed(this.settings.playback.defaultSpeed); // Set default speed if not found or misconfigured.
	    	return this.settings.playback.defaultSpeed;
		    
		} catch (error) {
			
			if (!this.errorLogger.getPlaybackSpeed) {
				
            	console.debug('Speedify - Moderate Error: Unable to retrieve playback speed from local storage. ( User Action Required )\n\nIt appears that Speedify may not be functioning correctly due to your browser disabling local storage. To address this issue, we recommend checking the full error message for further details on resolving this problem.\n\nFull error message:\n', error);
            	this.errorLogger.getPlaybackSpeed = true;
        	}
            
            return this.settings.playback.defaultSpeed;
        }
	}
	
	/**
	 * Sets the playback speed in local storage.
	 *
	 * @param {number} value - The playback speed value to set.
	 */
	 
	setPlaybackSpeed(value) {
		
		try {
            localStorage.setItem('playbackSpeed', value);
        } catch (error) {
        	
        	if (!this.errorLogger.setPlaybackSpeed) {
				
            	console.debug('Speedify - Moderate Error: Unable to save playback speed in local storage. ( User Action Required )\n\nIt appears that Speedify may not be functioning correctly due to your browser disabling local storage. To address this issue, we recommend checking the full error message for further details on resolving this problem.\n\nFull error message:\n', error);
            	this.errorLogger.setPlaybackSpeed = true;
        	}
        }
	}
	
	/**
	 * Validates the playback speed.
	 *
	 * @param {string} playbackSpeed - The playback speed to validate.
	 * @returns {boolean} True if the playback speed is valid, otherwise false.
	 */
	
	validPlaybackSpeed(playbackSpeed) {
		
	    let input = parseFloat(playbackSpeed); // str: '2.81abc' -> 2.81 | str: 'abc2.81' -> NaN 
	    
	    // Check if input is a valid number within defined bounds.
	    return !(isNaN(input) || this.settings.playback.minSpeed > input || input > this.settings.playback.maxSpeed)
	}
	
	/**
	 * Creates the playback speed button.
	 */
	
	createPlaybackBtn(onClickEvent) {
		
	    let btn = document.createElement('button');
	    btn.setAttribute('id', 'playback-speed-button');
	    btn.setAttribute('aria-label', 'Change speed');
	    btn.addEventListener("click", function(e) {onClickEvent(e);});
	    this.setSelectedPlaybackSpeedOfBtn(this.getPlaybackSpeed(), btn);
		
	    this.controllerContainer.prepend(btn);
	}
	
	/**
	 * Updates the displayed playback speed on the button and adjusts the data attribute.
	 *
	 * @param {number} selectedSpeed - The selected playback speed value.
	 */
	
	setSelectedPlaybackSpeedOfBtn(selectedSpeed, btn_playbackSpeed) {
		
		if (!btn_playbackSpeed)
			btn_playbackSpeed = document.querySelector('#playback-speed-button');
		
		btn_playbackSpeed.innerHTML = selectedSpeed + ' x';
		
		if (selectedSpeed % 1 != 0)
    		btn_playbackSpeed.setAttribute('data-multi-line', true);
    	else
    		btn_playbackSpeed.setAttribute('data-multi-line', false);
	}
	
	/**
	 * Updates the playback speed.
	 *
	 * @param {number} selectedSpeed - The selected playback speed value.
	 * @param {HTMLElement[]} mediaPlayer - The media player elements to update the playback speed for.
	 */
	
	updatePlaybackSpeed(selectedSpeed, mediaPlayers = document.querySelectorAll('audio, video')) {
		
		const btn_playbackSpeed = document.querySelector('#playback-speed-button');
		
	    // Update controller text.
		if (btn_playbackSpeed !== null)
			this.setSelectedPlaybackSpeedOfBtn(selectedSpeed);
		
	    // Update local storage.
	    this.setPlaybackSpeed(selectedSpeed);
	    
	    // Update playback speed.
		if (mediaPlayers !== null) {

			mediaPlayers.forEach((mediaPlayer) => {

				mediaPlayer.playbackRate = selectedSpeed;
			});
		}	
	}
	
	/**
	 * Monitors changes in the document for the addition of media elements.
	 * If a media element is added, this function attaches event listeners to monitor changes in playback speed.
	 */
	
	detectMediaElementAdditions() {
		
		const mediaParent = document.querySelector('body');
		const config = { childList: true, attributes: true, attributeFilter: ['src']}; // subtree: true
		
		// Create a MutationObserver instance.
		const observer = new MutationObserver((mutationsList, observer) => {
			
		    mutationsList.forEach((mutation) => {
		    	
		        // Check if a media element was added.
		        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
		        	
		            const addedNodesArray = Array.from(mutation.addedNodes);
		            const addedMediaElement = addedNodesArray.find(node => node.tagName && ( node.tagName.toLowerCase() === 'audio' || node.tagName.toLowerCase() === 'video' ));
		            
		        	if (addedMediaElement)
		            	this.monitorPlaybackSpeed(addedMediaElement);
		        } 
		    });
		});
		
		// Start observing the mediaParent node.
		observer.observe(mediaParent, config);
	}
	
	/**
	 * Attaches event listeners to media elements for monitoring changes in playback speed.
	 * @param {HTMLElement | HTMLElement[]} elements - Single or array of HTML media elements.
	 */
	
	monitorPlaybackSpeed(elements) {
		
		if (elements instanceof HTMLElement)
			elements = [elements];
		
		elements.forEach((element) => {
			
			['ratechange', 'playing'].forEach((event) => {
				
				element.addEventListener(event, () => {
					
					if (element.playbackRate !== this.getPlaybackSpeed()) 
						this.updatePlaybackSpeed(this.getPlaybackSpeed(), [element]);
				});
			});
		});
	}
	
	/**
	 * Sets up monitoring for media elements, including their addition and playback speed changes.
	 */
	
	initializeMediaElementsMonitoring() {
		
		this.monitorPlaybackSpeed(document.querySelectorAll('audio, video'));
		this.detectMediaElementAdditions();
	}
}