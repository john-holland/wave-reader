# Wave Reader


## Description

A reading extension to help browser users conquer reading, attention, and tracking issues.


## Demographic

Anyone who uses a computer screen for reading whom cannot interact.
Everyone who is reading or working on a terminal they cannot interact with physically will find increased reading and tracking confidence.
Those with tracking issues for reading or those who get stuck.
Focus problems and trouble staying on the same line.


## Goal / Functionality

Move pages smoothly with 3d animation to allow users to emulate reading a book on their lap or in their hands.
Provide a visual jump for anyone who needs to fiddle.
Allow for interacting differently with the web pages.


## Text Selection

Selection of text can use visibility and character count, but optimal selection is likely the most important to solve. Majority text count and font family is a sure bet, while the semantic html tag names could also be instructive. Ultimately a blanket selector can be used to select the base html but may get the control aspects of the page rather than the reading content. Majority font family could also be faulty, so it may be best to allow for a modal selector with font-family separated into different options. We should also be validating the visible size of the text is non-zero.


## CSS animation

Toggle-able animation is good and performant, but the mouse movement may require polling, and caching css classes. If we roll the css animations and apply them to each element selected, then only enable the pertinent direction, it may provide a performance decent mouse follow experience. The github code pages has the code text rotated perpendicularly, so we should perculate up the html tree and assert the rotation, applying additional css classes where necessary.


## Features

- css waving
- font family
- text selection
- selector input
- keyboard shortcuts
- wave mouse movement
- wave wasd movement
- wave image recognition
- easter eggs   
- state machine log view stability
- graphql integration
- settings saveable
- settings sync
- backend delivered defaults 


## License

Apache 2.0

