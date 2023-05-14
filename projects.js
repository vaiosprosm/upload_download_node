var fs = require("fs")
const fileName = "logfiles.json"

class BookList {
    myBooks =  {}

    async loadBooksFromFile() {
        try {
            const data = await fs.readFile(fileName, "utf-8")
            this.myBooks = JSON.parse(data)
            console.log(this.myBooks)
        } catch (error) {
            throw error
        }
    }

    async addBookToFile(newBook) {
        await this.loadBooksFromFile()
        if (!this.isBookInList(newBook)) {
            this.myBooks.books.push(newBook)
            try {
                await fs.writeFile(fileName, JSON.stringify(this.myBooks), {flag: "w+"})
            } catch (error) {
                throw error
            }
        }
    }

    isBookInList(book) {
        let bookFound = this.myBooks.books.find(item => (
            item.title===book.title &&
            item.author===book.author
        ));
        return bookFound
    }
}

module.exports =  BookList 








