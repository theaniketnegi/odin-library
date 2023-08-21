let books = [];

class Book {
  constructor(title, author, pages, readStatus) {
    this.id = Date.now();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
  }
}

const BookManager = (() => {
  const bookHolder = document.querySelector("main");
  function createBook(title, author, pages, readStatus) {
    const book = new Book(title, author, pages, readStatus);
    books.push(book);
    updateBooks(books);
  }

  function changeReadStatus(e) {
    const readStatusBtn = e.target;
    const divId = readStatusBtn.parentElement.dataset.id;

    books = books.filter((book) => {
      if (book.id == divId) {
        book.readStatus = !book.readStatus;
        if (book.readStatus) {
          readStatusBtn.classList.add("read");
          readStatusBtn.classList.remove("not-read");
        } else {
          readStatusBtn.classList.add("not-read");
          readStatusBtn.classList.remove("read");
        }
      }
      return book;
    });
    updateBooks(books);
  }
  function deleteBook(e) {
    const divId = e.target.parentElement.dataset.id;
    books = books.filter((book) => book.id != divId);
    updateBooks(books);
  }

  function updateBooks(books) {
    bookHolder.innerHTML = books
      .map((book) => {
        return `<div class="card" data-id=${book.id}>
      <h1>${book.title}</h1>
      <h3>${book.author}</h3>
      <h4>${book.pages}</h4>
      <div class="card-btn ${
        book.readStatus ? "read" : "not-read"
      }" onclick="BookManager.changeReadStatus(event)">${
          book.readStatus ? "Read" : "Not Read"
        }</div>
      <div class="card-btn remove" onclick="BookManager.deleteBook(event)">Remove</div>
      </div>`;
      })
      .join("");
    localStorageSave(books);
  }

  function localStorageSave(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }
  function localStorageLoad() {
    if (localStorage.getItem("books"))
      return JSON.parse(localStorage.getItem("books"));
    return [];
  }

  return {createBook, updateBooks, changeReadStatus, deleteBook, localStorageLoad}
})();

const newBookBtn = document.getElementById("add-book-btn");
const closeBtn = document.getElementById("close-btn");
const confirmBtn = document.getElementById("confirm-btn");
const addBookDialogue = document.getElementById("add-book");

newBookBtn.addEventListener("click", () => {
  addBookDialogue.showModal();
});

closeBtn.addEventListener("click", () => {
  addBookDialogue.close();
});

confirmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const pages = document.getElementById("pages");
  const readStatus = document.getElementById("read");
  BookManager.createBook(title.value, author.value, pages.value, readStatus.checked);
  title.value = author.value = pages.value = "";
  readStatus.checked = false;
  addBookDialogue.close();
});

books = BookManager.localStorageLoad();
BookManager.updateBooks(books);
