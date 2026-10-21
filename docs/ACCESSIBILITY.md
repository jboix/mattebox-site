# Accessibility

[mattebox.ch](https://mattebox.ch/) aims to meet
[WCAG 2.2](https://www.w3.org/TR/WCAG22/) at level AA. Nobody has audited
it by hand, so this is a goal, not a claim of conformance.

## How it is checked

- Biome's accessibility lint rules run on the code.
- The build checks every link, and that every page has its own title and a description.

## What the site does

- A skip link at the top of every page jumps to the content.
- Every page declares its language.
- The theme follows the system's light or dark setting, and you can change it.
- A visible focus ring shows on keyboard focus.
- The video on the home page plays in [`<mattebox-player>`](https://github.com/jboix/mattebox-player), with its keyboard support and named controls.

## Known limitations

- No automated WCAG check runs on the built pages yet. axe-core is planned.
- VoiceOver, TalkBack, NVDA and JAWS have not been tested by hand.
- Windows high contrast mode (forced colours) has not been checked.
- The video on the home page has the player's limitations. The player's [accessibility statement](https://github.com/jboix/mattebox-player/blob/main/docs/ACCESSIBILITY.md) lists them.

## Report a barrier

[Open an accessibility issue](https://github.com/jboix/mattebox-site/issues/new?template=03_accessibility.yml)
and say what stopped you, on which page, with which device, browser and
assistive technology. Every report is read. There is no fixed timeline for
a fix.
