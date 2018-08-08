## WooCommerce Order Exports Plugin
**Language: PHP**

This was a plugin I wrote for a client who wanted to be able to create exports of WooCommerce orders but also include specific custom fields. The client had tried various products online, but none included all the data she needed.

I used an Object Oriented Programming pattern to improve code readability and keep the code organised.

## Example (WiP) - React using WP-API
**Language: JavaScript**

This is an example of an interface I've been working for a client. It's purpose was to allow profile data to be pulled from the WP-API into an external website.

It's configured with webpack, using ES6 transpiled by Babel.

Other depenencies are react-router, axios, and react-google-maps.

## Example JavaScript - Manage Users Module
**Language: JavaScript**

This is a module from a larger JavaScript interface which integrate alongside WordPress. This specific module handles a 'Manage Users' page, where user groups can be created and users sorted into multiple groups. One complexity was allowing the user to bulk-edit users into groups.

This is written in ES6 JavaScript (which allows the use of classes, arrow functions etc), but it would then be compiled into regular JavaScript using Babel with Gulp. It also makes use of jQuery.

As with the plugin above, I have used OOP, specifically classical objects to keep quite a complicated UI nice and tidy. I could have used a framework such as React to create the view, but I felt it was useful for me to tackle this issue without a framework doing the work for me and I learned a lot in the process. 

Example JavaScript - Pricing Calculator.js
Language: JavaScript

A pricing calculator was required as part of a quotation system. As above, this follows OOP, except this time not written in ES6 and did not require the use of Babel to compile the code.

## Example of SASS module
**Language: SASS**

This is a straightforward module of a SASS stylesheet. I would then use Gulp to watch for changes and compile into a regular CSS stylesheet. For this project I used a SASS grid framework called Avalanche which also provided the media queries (referenced as variables in the example, e.g. $pocket).

It is a template module, which means stlying specific to particular views are handled in this file, as opposed to more general styling (e.g. typography, forms, etc).
