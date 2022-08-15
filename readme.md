# MIDI Visualizer
This is a p5.js sketch that, given a MIDI's file corresponding JSON, renders a vectorial graphical representation of such MIDI file.

This sketch is inspired by how Harold D. Craft, Jr. [represented the one of first pulsar signals received](https://blogs.scientificamerican.com/sa-visual/pop-culture-pulsar-the-science-behind-joy-division-s-unknown-pleasures-album-cover/) in his work: "Radio Observations of the Pulse Profiles and Dispersion Measures of Twelve Pulsars".

Here is an example of my sketch visualizing a selection of riffs from Pillars Of Serpents by Trivium:

![PillarsOfSerpents](https://user-images.githubusercontent.com/26527575/184626906-479ea34e-f46f-4129-befb-98f227db835f.png)

For each note or chord in the midi file, a white line is rendered, starting from the top of the image, going down towards the bottom. Lines are closer together if notes/chords are short, conversely, they are further apart if notes/chords are long.
Notes render lines that quickly become flat, chords instead result in lines that are "wavy" for longer. Peaks in the left portion of the line correspond to lower notes/chords, the opposite is true for peaks in the right portion of the line.
The area underlying the lines is colored based on the guitar technique used to play the note/chord. This information has to be added to information given by the midi file since it isn't encoded in midi.
