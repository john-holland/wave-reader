
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
