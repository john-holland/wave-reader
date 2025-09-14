# Page snapshot

```yaml
- heading "Wave Reader Test Controls" [level=3]
- text: Ready for testing
- strong: "Debug Info:"
- text: "Extension: ❌ Chrome APIs: ❌ Content Scripts: ❌"
- button "Test Mouse Wave"
- button "Test CSS Template"
- button "Test Toggle (Alt+W)"
- button "Test Keyboard Input"
- button "Test Performance"
- button "Clear Status"
- button "Refresh Debug Info"
- heading "Basic Text Content" [level=2]
- paragraph: This is a simple paragraph to test the Wave Reader extension. The text should be readable and the wave animation should be smooth and non-distracting.
- paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
- heading "Long Form Content" [level=2]
- paragraph: The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. It's commonly used to test fonts and keyboard layouts.
- paragraph: "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort."
- paragraph: It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way.
- heading "Technical Content" [level=2]
- paragraph: The Wave Reader extension is designed to assist with eye tracking during reading by providing a subtle wave animation that follows the mouse cursor. This helps maintain focus and reduces eye strain during extended reading sessions.
- paragraph: The extension uses CSS animations and JavaScript to create smooth, responsive wave effects. It supports both mouse-following mode and template-based CSS animations. The performance is optimized with thresholds and cleanup mechanisms to prevent memory leaks.
- paragraph: "Key features include: automatic initialization, performance monitoring, error handling with retry mechanisms, and support for both regular DOM and Shadow DOM contexts."
- heading "Mixed Content" [level=2]
- paragraph: Here's some highlighted text to test how the wave animation handles different text styles and formatting.
- paragraph:
  - text: This paragraph contains
  - strong: bold text
  - text: ","
  - emphasis: italic text
  - text: ", and underlined text to ensure the wave animation works well with various text decorations."
- paragraph: The extension should maintain readability while providing the wave animation effect. Users should be able to read comfortably without the animation being distracting or causing eye strain.
```