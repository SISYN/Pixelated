  /****************************************************************************************************************************************************
   * PixelatedGame() - [Constructor Method] Initiates a new instance of the PixelatedGame class object
   * @param interface_container      -    The selector or jQuery element for the container of the game interface
   * @param rows      -    (Optional) Allows specification of the number of rows the game board will contain
   * @param columns   -    (Optional) Allows specification of the number of columns the game board will contain
   * @param colors    -    (Optional) An array of colors to use for the buttons and blocks (can be used to set number of colors)
   * @return object   -    returns `this`
   ****************************************************************************************************************************************************/
  function PixelatedGame( interface_container , rows , columns , colors ) {
    // Just to show what object attributes are available
    this.blob; // Holds all active blocks
    this.moves = 0; // Holds the number of moves the player has used so far
    this.interface; // Holds the jQuery object for the game's interface to be outputted
    this.interface_container; // The jQuery DOM element that contains the interface HTML

    // Use options so that the game is easily modifiable
    this.options = {
      'rows'      :   5 , // number of rows to use for the board
      'columns'   :   4 , // number of columsn to use for the board
      'colors'    :   [   // change colors however you like, less colors = easier & more colors = harder
        'blue'    ,             // colors can be CSS color names
        'green'   ,
        'purple'  ,
        'orange'  ,
        '#ff0000' ,             // they can also be HEX values
        'rgb(0, 255, 255)'     // they can also be RGB values
      ]
    };


      if ( typeof interface_container != typeof $('<div>') )
        interface_container = $(interface_container);

      this.interface_container = interface_container;

    // Check if attributes are specified
    // (We technically should be using $.extend() or similar methodology here but its less to digest this way)
    if ( typeof rows == typeof 1 )
      this.options['rows'] = rows;
    if ( typeof columns == typeof 1 )
      this.options['columns'] = columns;
    if ( typeof colors == typeof [] )
      this.options['colors'] = colors;

    this.Render();
    this.Listener();
    this.Output();

    // return `this` to denote it's a class constructor rather than an ordinary function
    return this;
  }




  /****************************************************************************************************************************************************
   * Output() - Outputs the game board to the specified element
   * @param board_container - Object or selector string specifying the DOM element that will contain the game board
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.Output = function(board_container) {
    this.blob = [0]; // reset the active blob for this fresh round
    this.moves = 0; // reset the total moves for this fresh round
    this.interface_container.html('').append(this.interface);

    return this;
  };


  /****************************************************************************************************************************************************
   * Render() - Renders the game board to the specified element
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.Render = function() {
    var controls, board, buttons, blocks, stats;
    // controls   -   contains the colored buttons that are used to play the game
    // board      -   contains all blocks
    // buttons    -   the buttons that go in `controls`
    // blocks     -   the blocks that go in `board`
    // stats      -   area that contains # of moves/tries

    // Create buttons for controls
    buttons = $('<div>');
    for(var i = 0; i < this.options.colors.length; i++)
      buttons.append(
        $('<button>').attr('data-color', this.options.colors[i]).css('background', this.options.colors[i])
      );

    // Create blocks for board
    blocks = $('<div>');
    for(var i = 0; i < this.options.rows * this.options.columns; i++) {
      var random_color_id, rand_min, rand_max;
      rand_min = 0;
      rand_max = this.options.colors.length - 1;
      random_color_id = Math.floor(Math.random() * (rand_max - rand_min + 1)) + rand_min; // Unfortunately, native JavaScript doesn't have a pretty way of doing rand(min,max)

      blocks.append(
        $('<span>').
          attr('data-id', i).
          addClass('Pixelated--Interface--Board--Block').
          attr('data-color', this.options.colors[random_color_id]).
          css('background', this.options.colors[random_color_id])
      );

      // Check if its time to end a row, if so, append a line break
      if ( ((i + 1) % this.options.columns) == 0 && i < this.options.rows * this.options.columns - 1 )
        blocks.append('<br />');

    }


    stats      =   $('<p>').addClass('Pixelated--Interface--Stats').addClass('text-center').html( this.moves );
    controls   =   $('<div>').addClass('Pixelated--Interface--Controls').append( buttons );
    board      =   $('<div>').addClass('Pixelated--Interface--Controls').append( blocks );

    this.interface = $('<div>').attr('id', 'PixelatedGameInterface').append(controls).append(board).append(stats);

    return this;
  };


  /****************************************************************************************************************************************************
   * Listener() - Listens for control button click events
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.Listener = function() {
    var self = this;
    // Clear the old listener (if applicable) and declare a new listener for clicks on the control buttons
    $(document).off('click', '.Pixelated--Interface--Controls button').on('click', '.Pixelated--Interface--Controls button', function(e) {
      var color = $(this).attr('data-color');
      console.log('Control clicked for '+color);
      self.SelectColor(color);
    });
    return this;
  };

  /****************************************************************************************************************************************************
   * ApplyColor() - Applies a color to the board after being clicked
   * @param color - the color you wish to apply
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.SelectColor = function(color) {
    this.moves++;
    $('.Pixelated--Interface--Stats').html(this.moves);
    for(var i = 0; i < this.blob.length; i++) {
      // Check for neighbors with this color to add to the blob
      var block_id = this.blob[i];
      this.ApplyColorToBlock(block_id, color); // apply the color to the current block
      this.InspectNeighbors(block_id, color);  // inspect the neighboring blocks of the current block
    }


    return this;
  };

  /****************************************************************************************************************************************************
   * InspectNeighbors() - Inspects all neighboring blocks of a given block_id for the given color
   * @param block_id - the id of the block being checked
   * @param color - the color you wish to check for
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.InspectNeighbors = function(block_id, color) {
    console.log('Inspecting neighbors of '+block_id);
    if ( block_id > 0 && block_id % this.options.columns != 0 ) // It must have a neighbor to the west
      this.InspectBlock(block_id - 1 , color);
    if ( block_id >= this.options.columns ) // It must have a neighbor to the north
      this.InspectBlock(block_id - this.options.columns , color);
    if ( block_id < this.options.columns * this.options.rows - this.options.columns ) // It must have a neighbor to the south
      this.InspectBlock(block_id + this.options.columns , color);
    if ( block_id < this.options.columns * this.options.rows - 1 && (block_id+1) % this.options.columns != 0 ) // It must have a neighbor to the east
      this.InspectBlock(block_id + 1 , color);

    return this;
  };

  /****************************************************************************************************************************************************
   * InspectBlock() - Checks if this blocks color matches the supplied color, if it does, its added to the active blob
   * @param block_id - the id of the block being checked
   * @param color - the color you wish to check for
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.InspectBlock = function(block_id, color) {
    var block = $('[data-color][data-id="'+block_id+'"]');
    console.log('Inspecting block '+block_id+' for '+color+' and found '+block.attr('data-color'));
    if ( block.attr('data-color') == color )
      this.AddBlock(block_id, color);
    return this;
  };

  /****************************************************************************************************************************************************
   * AddBlock() - Adds the block_id to the blob and changes its color
   * @param block_id - the id of the block being checked
   * @param color - the color you wish to check for
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.AddBlock = function(block_id, color) {
    console.log('Adding block '+block_id);
    this.ApplyColorToBlock(block_id, color);
    if ( this.blob.indexOf(block_id) < 0 )
      this.blob[this.blob.length] = block_id;
    return this;
  };

  /****************************************************************************************************************************************************
   * ApplyColorToBlock() - Applys the selected color to the selected block id
   * @param block_id - the id of the block being checked
   * @param color - the color you wish to check for
   * @return object - returns `this`
   ****************************************************************************************************************************************************/
  PixelatedGame.prototype.ApplyColorToBlock = function(block_id, color) {
    console.log('Applying '+color+' to block '+block_id);
    $('[data-color][data-id="'+block_id+'"]').attr('data-color', color).css('background', color);
    return this;
  };
