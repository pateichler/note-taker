# Note Taker

This is a playground for prototyping a note taking web application and learning ReactJS. It is currently intended as a personal project.

Below is a sample of the prototype note app.

![alt text](https://github.com/pateichler/note-taker/blob/main/note-taker.gif)

The application supports the keyboard shortcuts:
- `cmd + enter`: Edit current selected note.
- `cmd + I`: Move selected note to parent.
- `cmd + K`: Move selected note to first child.
- `cmd + L`: Move selected note to next sibling.
- `cmd + J`: Move selected note to previous sibling.

## Motivation

The goal of the prototype app was to test out a friction-less note taking application by using keyboard shortcuts to navigate the application. The project also had the long term vision of a note application such as [Obsidian](https://obsidian.md), where you can add links to other notes and create a complex graph structure.

## Usage
To run the server clone the repository and run the following commands with npm:

```
npm install
npm run dev
```
Then navigate to `localhost:3000/my-list` to test the current application features.