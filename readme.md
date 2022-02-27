# (🌊 r.) Wave Reader

A motion assisted reading extension for Chrome.

### sample wave css

```css
@-webkit-keyframes wobble {
  0% { transform: translateX(0%); rotateY(-2deg); }
  15% {transform: translateX(-1%) rotateY(2deg);}
}

.wave-reader__text {
  -webkit-animation-name: wobble;
  animation-name: wobble;
  -webkit-animation-duration: 4s;
  animation-duration: 4s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}
```

### events:
  - page load
  - select element
  - select text
  - start selector choose
  - adjust selector
  - send selector
  - receive selector
  - start text wave
  - start text wave with keyboard shortcut
  - send start message
  - receive start message
  - send stop message
  - receive stop message
  - send css modify message
  - receive css modify message
  - load and inject modified css
  - reset to defaults
  - settings:
    - wave speed
    - reset speed
    - text size, font
    - text color, background color?
    - vertical axis rotation amount (`rotateY(#deg);`)
    - save settings

### models:

  - startMessage:
    - wave: Wave
  - stopMessage:
    - /* no args */
  - updateSelectorMessage:
    - selector: String
    - reset: Boolean? = false
  - updateWaveMessage:
    - waveSpeed: String?
    - axisRotationAmount: Number?
    - text: Text?
  - startSelectorChooseMessage:
    - selector: String? = existingSelector || null

  - wave: Wave {
    - selector: String
    - cssTemplate: String
    - waveSpeed: String?
    - axisRotationAmount: Number?
    - text: Text {
      - textSize: String?
      - textColor: String?
    - }
  - }

### acknowledgements

[@SunnyGolovine react chrome extension tutorial](https://medium.com/@SunnyGolovine/build-a-chrome-extension-using-reactjs-and-webpack-part-1-976a414b85d0)

### license

MIT

## appendix

### sequence diagram

[sequence diagram image](https://imgur.com/a/olcUuw0)

  ```mermaid
  sequenceDiagram
      participant 🤓 reader
      participant 🌊 r
      participant 🌊 r receiver
      participant tab receiver
      participant tab
      
        🤓 reader->>+🌊 r: opens extension
        🤓 reader->>+🌊 r: clicks choose text
        🌊 r->>+tab receiver: sends start selector choose message (closes 🌊 r)
        tab receiver->>+tab: hover over shows all similar text node selections
        tab receiver->>+tab: click populates 🌊 r selector input
        tab->>+🌊 r receiver: send update selector message, opens 🌊 r
        🌊 r receiver->>+🌊 r: receives and updates selector message
        🤓 reader->>+🌊 r: updates selector input text box
        🌊 r->>+tab receiver: send update selector
        tab receiver->>+tab: show changes by highlighting text node selections, and fading after 5 seconds
        🤓 reader->>+🌊 r: clicks "select" button next to input selector
        🌊 r->>+tab receiver: sends start selector choose message (closes 🌊 r)
        tab receiver->>+tab: hover over shows all similar text node selections
        tab receiver->>+tab: click populates 🌊 r selector input
        tab->>+🌊 r receiver: send update selector message, opens 🌊 r
        🌊 r receiver->>+🌊 r: receives and updates selector message
        🤓 reader->>+🌊 r: clicks start button
        🌊 r->>+tab receiver: send start message
        tab receiver->>+tab: start received, inject css
        tab->>+🌊 r injected css: injects css class names to selector
        tab->>+🤓 reader: reads at an exhilerating pace!
        🤓 reader->>+🌊 r: stops 🌊 r. with extension button
        🌊 r->>+tab receiver: send stop message
        tab receiver->>+tab: receives and stops
        tab->>+🌊 r injected css: removes injected css class names
        🤓 reader->>+tab: stops 🌊 r. with keyboard shortcut
        tab->>+🌊 r injected css: stops, and removes injected css class names
        tab->>+🌊 r receiver: send shortcut_stopped message
        🌊 r receiver->>+🌊 r: send shortcut_stopped message for state parity
  ```
