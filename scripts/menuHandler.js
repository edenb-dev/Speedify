/**
 * Handles menu creation and event handling.
 * @class
 */

class MenuHandler {
	
	/**
     * Creates a MenuHandler.
     * @constructor
     *
     * @param {HTMLElement} menuParent - The HTML element where the menu will be added.
     * @param {PlaybackSpeedController} playbackSpeedController - The associated playback speed controller.
     */
	
	 constructor(menuParent, playbackSpeedController) {
	 	 
        this.menuParent = menuParent;
        
        /**
         * The associated playback speed controller.
         * @type {PlaybackSpeedController}
         */
         
        this.playbackSpeedController = playbackSpeedController;
        
        // Bind event handler functions to the class instance.
        this.clickOutsideHandler = this.detectClickOutsideMenu.bind(this);
    }
    
    
    /**
	 * Toggles the display of the menu.
	 *
	 * @param {Event} event - The click event.
	 */
	
	toggleMenu(event) {
		
	    // Stops additional click events from being fired. 
	    if (event)
	        event.stopPropagation();
	    
	    if (document.getElementById('menuContainer') === null)
	        this.createMenu();
	    else
	        this.closeMenu();
	}
	
	/**
	 * Closes the menu.
	 */
	
	closeMenu() {
		
	    const menuContainer = document.getElementById('menuContainer');
	        
		if (menuContainer !== null)
			menuContainer.remove();
		
	    document.removeEventListener("click", this.clickOutsideHandler);
	}
	
	/**
	 * Creates the playback speed selection menu.
	 */
	
	createMenu() {
		
	    // Step 1:
	    // Get current playback speed.
	    
	    let selectedSpeed = this.playbackSpeedController.getPlaybackSpeed();
	    
	    
	    // Step2:
	    // Create menu container.
	    
	    let menuContainer = document.createElement('div');
	    menuContainer.setAttribute('id', 'menuContainer');
	    
	    let span = document.createElement('span');
	    span.setAttribute('dir', 'auto');
	    span.setAttribute('aria-hidden', 'true');
	    span.innerHTML = 'Playback Speed';
	    
	    let menuItemsContainer = document.createElement('ul');
	    menuItemsContainer.setAttribute('tabindex', '-1');
	    menuItemsContainer.setAttribute('role', 'menu');
	    
	    menuContainer.appendChild(span);
	    menuContainer.appendChild(menuItemsContainer);
	    
	    
	    // Step 3:
	    // Create menu items.
	    
	    const settings = this.playbackSpeedController.settings;
	    
	    for (let i = (settings.playback.maxSpeed - settings.playback.minSpeed) / settings.playback.interval; i >= 0; i--) {
	    	
	        let formatedSpeed = Math.round((settings.playback.maxSpeed - settings.playback.interval * i) * 10) / 10; 
	        
	        // Create item.
	        let li = document.createElement('li');
	        li.setAttribute('role', 'presentation');
	        
	        let btn = document.createElement('button');
	        btn.setAttribute('role', 'menuitemradio');
	        btn.setAttribute('aria-label', 'Speed ' + formatedSpeed + 'x');
	        btn.setAttribute('aria-checked', (formatedSpeed == selectedSpeed) ? 'true' : 'false');
	        btn.setAttribute('tabindex', (formatedSpeed == selectedSpeed) ? '0' : '-1');
	        btn.addEventListener("click", () => {this.updatePlaybackSpeed(formatedSpeed);});
	        
	        let span = document.createElement('span');
	        span.setAttribute('dir', 'auto');
	        span.innerHTML = formatedSpeed + 'x';
	        
	        li.appendChild(btn);
	        btn.appendChild(span);
	        if (formatedSpeed == selectedSpeed)
	            btn.innerHTML += '<svg role="img" aria-hidden="true" viewBox="0 0 16 16" class="kPpCsU"><path d="M15.53 2.47a.75.75 0 0 1 0 1.06L4.907 14.153.47 9.716a.75.75 0 0 1 1.06-1.06l3.377 3.376L14.47 2.47a.75.75 0 0 1 1.06 0z"></path></svg>';
	        
	        
	        // Add item to container.
	        menuItemsContainer.appendChild(li);
	    }
	    
	    
	    // Step 4:
	    // Display menu.
	    
	    this.menuParent.prepend(menuContainer);
	    
	    menuItemsContainer.querySelector('svg').scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center'}); // scroll to selected item.
	    
	    document.addEventListener("click", this.clickOutsideHandler);
	}
	
	/**
     * Updates the playback speed.
     *
     * @param {number} selectedSpeed - The selected playback speed value.
     */
    
	updatePlaybackSpeed(selectedSpeed) {
	
		this.closeMenu();
	
		// Delegating playback speed update to the associated PlaybackSpeedController.
		this.playbackSpeedController.updatePlaybackSpeed(selectedSpeed);
	}
	
	/**
	 * Detects clicks outside the menu to close it.
	 *
	 * @param {Event} event - The click event.
	 */
	 
	detectClickOutsideMenu(event) {
	    
	    let menuContainer = document.getElementById('menuContainer');
	    
	    let clickedElement = event.target;
	    let menuClicked = false;
	    
	    do {
	        if (menuContainer == clickedElement) {
	            menuClicked = true;
	            break;
	        }
	        
	        clickedElement = clickedElement.parentNode;
	    } while (clickedElement);
	    
	    if (!menuClicked)
	        this.closeMenu();
	}
}