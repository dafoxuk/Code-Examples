WooCommerce Order Exports Plugin
================================
Language: PHP

This was a plugin I wrote for a client who wanted to be able to create exports of WooCommerce orders but also include specific custom fields. The client has tried various products online, but none included all the data she needed.

I used an Object Oriented Programming pattern to improved code readability and keep the code organised.

Example JavaScript - Manage Users Module
========================================
Language: JavaScript

This is a module from a larger JavaScript interface which integrate alongside WordPress. This specific module handles a 'Manage Users' page, where user groups can be created and users sorted into multiple groups. One complexity was allowing the user to bulk-edit users into groups.

This is written in ES6 JavaScript (which allows the use of the classes, arrow functions etc), but would then be compiled into regular JavaScript using Babel with Gulp. It also makes use of jQuery.

As with the plugin above, I have used OOP, specifically classical objects to keep quite a complicated UI nice and tidy. I could have used a framework such as React to create the view, but I felt it was useful for me to tackle this issue without a framework doing the work for me and I learned alot in the process. 

Examples of SASS module
=======================
Language: SASS

This is a straightforward module of a SASS stylesheet. I would then use Gulp to wach for changes and compile into a regular CSS stylesheep. For this project I used a SASS grid framework called Avalanche which also provided the media queries (referenced as variables in the example, e.g. $pocket).

It is a template module, which means stlying specific to particular views are handled in this file, as opposed to more general styling (e.g. typography, forms, etc)





