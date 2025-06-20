class Flashcard {
    constructor(term, definition, value) {
        this.term = term,
        this.definition = definition,
        this.value = value
    }
}

class Set {
    constructor(name, flashcards) {
        this.name = name,
        this.flashcards = flashcards
    }
}

export {Flashcard, Set}