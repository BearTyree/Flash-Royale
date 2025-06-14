class Flashcard {
  constructor(term, definition, value) {
    (this.term = term), (this.definition = definition), (this.value = value);
    this.id = Math.random();
  }
}

class Set {
  constructor(name, flashcards) {
    (this.name = name), (this.flashcards = flashcards);
  }
}

export { Flashcard, Set };
