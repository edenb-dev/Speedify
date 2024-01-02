/*
  Script: domElementInterceptor.js
  Description: This script intercepts Spotify's creation of video/audio elements and adds them to the document for control over playback features.
*/


/**
 * Intercepting Spotify's creation of video/audio elements.
 */
 
(function handleSpotifyPlaybackElements() {
	
	// Backup reference to the browser's original document.createElement.
  	var originalCreateElement = document.createElement;
  	
	  /*
	    Overriding the browser's document.createElement function to manipulate video and audio elements.
	  */
	  document.createElement = function (tagName) {

	    // Calling the backup reference of createElement with the arguments and assigning it to the 'element' variable.
	    var element = originalCreateElement.apply(this, arguments);

	    // Checking if Spotify scripts are creating a video or audio element.
		if (tagName === 'video' || tagName === 'audio') {
			
			// Hiding the media element.
			element.style.display = 'none';
			
			// Adding the element to the main document.
			document.body.appendChild(element);
	    }

	    return element; // Returns the element to allow the page creation to proceed.
	  };
})();