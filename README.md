# Pixelated

Simple game made in 2006 for a high-school Java class, revised for educational purposes.

If you're interested in learning to make simple games like this one, [check out the tutorial](http://sisyn.com/resources/pixelated), or you can [play the official demo](http://sisyn.com/resources/pixelated/play). There's also a [pre-made fiddle](https://jsfiddle.net/sktjhxcy/) if you want to mess with it.

## Getting Started

Initializing a new game is easy with the `PixelatedGame` class.

```
new PixelatedGame( container , rows , columns , colors );
```

### Prerequisites

jQuery was used in a few places to make DOM interactions more straightforward for beginners.

### Installing

You can use your own call to `new PixelatedGame` and avoid the `demo.js` file if you wish.

```
core.js  -- the PixelatedGame class
core.css -- basic styling for blocks and buttons
demo.js  -- example game init with options
```

To include them in your project:


    <script src="../core.js"></script>
    <link rel="stylesheet" href="../core.css" />


That's it!

## Deployment

For demo purposes, a few options are built in. You can set the rows, columns, and colors. More colors usually creates a harder game.
Colors can be expressed as hex, rgb, or css color names.

    new PixelatedGame('.game_container', 6, 9, [
      'blue',
      '#f00',
      'orange',
      'rgb(255, 150, 150)',
      'yellow'
    ]);


For a full playground with all available options, check out [this fiddle](https://jsfiddle.net/sktjhxcy/).

## Built With

* [jQuery](http://api.jquery.com/) - Javascript framework used for simplifying DOM interactions

## Authors

* **Dan Lindsey** - *Initial work* - [SISYN](https://sisyn.com)

## License

This project is licensed under the GPL v3 License - see the [LICENSE](LICENSE) file for details
