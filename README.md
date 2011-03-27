# jQuery Scrollpane

* [Website](https://github.com/jpsullivan/jquery-scrollpane)
* [Bugtracker & feature requests](https://github.com/jpsullivan/jquery-scrollpane/issues)
* Version: 1.0.0

## Description

This plugin was written to simulate the iOS scrollbar, and should be used on areas with a fixed width/height where using a default scrollbar would feel obtrusive.
This will also gracefully degrade to a default scrollbar if the browser does not support certain document modifications.

## Usage

To use this plugin, first make sure your defined area is absolutely positioned, and that overflow is hidden.
For example, the following markup would comply:

    <div id="my-scrollblock">
        <ul>
            %list_items%
        </ul>
    </div>

And the CSS for this block would be:

    #my-scrollblock {
        position:absolute;
        height:200px; /* only used for demo purposes */
        width:180px; /* only used for demo purposes */
        overflow:hidden;
    }

Once these are defined, you can then execute the plugins default function:

    $('#my-scrollblock').scrollpane();

And you're set!

## Development Team / Contact Info

* Josh Sullivan - Lead Developer ([http://github.com/jpsullivan](http://github.com/jpsullivan))

## Requirements

* jQuery 1.4.4+