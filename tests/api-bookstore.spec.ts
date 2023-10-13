import { test, expect } from '@playwright/test';

const reviewedBook = JSON.parse(JSON.stringify(require('../test-data/reviewedBook.json')));
const unreviewedBook = JSON.parse(JSON.stringify(require('../test-data/unreviewedBook.json')));
const newReviewedBook = JSON.parse(JSON.stringify(require('../test-data/newReviewedBook.json')));
const newUnreviewedBook = JSON.parse(JSON.stringify(require('../test-data/newUnreviewedBook.json')));

test.describe('get books', () => {

    test.beforeAll(async () => {
        // Reset db
    });

    test('gets list of all books', async ({ request }) => {
        const response = await request.get(`/books`);
            expect(response.status()).toBe(200);
            const body = await response.json();
                expect(body.books.length).toBeGreaterThan(1);
    });

    test('gets books filtered by genre', async ({ request }) => {
        const response = await request.get(`/books?genre=${reviewedBook.genre}`);
            expect(response.status()).toBe(200);
            const body = await response.json();
                expect(body.books.length).toBeGreaterThanOrEqual(1);
                expect(body.books[0].genre).toBe(reviewedBook.genre);
    });
  
    test('gets books filtered by author', async ({ request }) => {
        const response = await request.get(`/books?author=${reviewedBook.author}`);
            expect(response.status()).toBe(200);
            const body = await response.json();
                expect(body.books.length).toBeGreaterThanOrEqual(1);
                expect(body.books[0].author).toBe(reviewedBook.author);
    });
  
    test('gets books filtered by genre and author', async ({ request }) => {
        const response = await request.get(`/books?genre=${reviewedBook.genre}&author=${reviewedBook.author}`);
            expect(response.status()).toBe(200);
            const body = await response.json();
                expect(body.books.length).toBeGreaterThanOrEqual(1);
                expect(body.books[0].genre).toBe(reviewedBook.genre);
                expect(body.books[0].author).toBe(reviewedBook.author);
    });

    test('gets specific reviewed book', async ({ request }) => {
        const response = await request.post(`/books/${reviewedBook.id}`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toEqual(reviewedBook);
    });

    test('gets specific unreviewed book', async ({ request }) => {
        const response = await request.post(`/books/${unreviewedBook.id}`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toEqual(unreviewedBook);
    });    
  
    test('attempt to get invalid book', async ({ request }) => {
        const response = await request.post(`/books/0`);
            expect(response.status()).toBe(400);
    });
});
  
test.describe('attempt to get books with invalid filter parameters', () => {

    test.beforeAll(async ({ request }) => {
        // Reset db
    });
    
    test('attempt to get invalid book', async ({ request }) => {
        const response = await request.post(`/books/0`);
            expect(response.status()).toBe(400);
    });
  
    test('attempt to get books filtered by invalid genre', async ({ request }) => {
        const response = await request.get(`/books?genre=notRealGenre`);
            expect(response.status()).toBe(400);
            const body = await response.json();
                expect(body.message).toEqual("Invalid genre");
  
    });
  
    /** 
     * Add similar attempting to get books with invalid/missing genres and/or authors.
    */
});

test.describe('add and delete books', () => {

    test.beforeEach(async () => {
        // Reset db
    });   

    test('add, get and delete unreviewed book', async ({ request }) => {

        const addBookResponse = await request.post(`/books`, {
            data: newUnreviewedBook
        });
            expect(addBookResponse.status()).toBe(201);
            const addBookBody = await addBookResponse.json();
                expect(addBookBody.id).toBeTruthy();
                expect(addBookBody.message).toBe("Book added successfully");   

        const newBookResponse = await request.get(`/books/${addBookBody.id}`);
            expect(newBookResponse.status()).toBe(200);
            const newBookBody = await newBookResponse.json();
                expect(newBookBody).toEqual(newUnreviewedBook);     
        
        const deleteBookResponse = await request.delete(`/books/${addBookBody.id}`);
            expect(deleteBookResponse.status()).toBe(200);
        
        const deleteBookAgainResponse = await request.delete(`/books/${addBookBody.id}`);
            expect(deleteBookAgainResponse.status()).toBe(410);
            const deleteAgainBody = await deleteBookAgainResponse.json();
                expect(deleteAgainBody.message).toEqual("Book does not exist.");    

        const getDeletedBookResponse = await request.get(`/books/${addBookBody.id}`);
            expect(getDeletedBookResponse.status()).toBe(404);
            const getDeletedBookBody = await getDeletedBookResponse.json();
                expect(getDeletedBookBody.message).toEqual("Book does not exist.");   
    });

    test('add book with review and attempt to delete', async ({ request }) => {

        const addBookResponse = await request.post(`/books`, {
            data: newReviewedBook
        });
            expect(addBookResponse.status()).toBe(201);
            const body = await addBookResponse.json();
                expect(body.id).toBeTruthy();

        const newBookResponse = await request.get(`/books/${body.id}`);
            expect(newBookResponse.status()).toBe(200);
            const newBookBody = await newBookResponse.json();
                expect(newBookBody).toEqual(newReviewedBook);     
        
        const deleteBookResponse = await request.delete(`/books/${body.id}`);
            expect(deleteBookResponse.status()).toBe(403);
            const deleteBookBody = await deleteBookResponse.json();
                expect(deleteBookBody.message).toEqual("Cannot delete reviewed book.");  
    });
});

test.describe('attempt to add books with invalid parameters/body}', () => {

    test.beforeEach(async () => {
        // Reset db
    }); 

    test('attempt to add same book again', async ({ request }) => {
        const addBookResponse = await request.post(`/books`, {
            data: reviewedBook,
        });
            expect(addBookResponse.status()).toBe(201);
            const body = await addBookResponse.json();
                expect(body.id).toBeTruthy();
                expect(body.message).toBe("Book added successfully");

        const addBookAgainResponse = await request.post(`/books`, {
            data: reviewedBook,
        });
            expect(addBookAgainResponse.status()).toBe(409);
            const againBody = await addBookResponse.json();
                expect(againBody.message).toBe("Book already exists");
    });

    test('attempt to add book without genre', async ({ request }) => {
        const response = await request.post(`/books`, {
            data: {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald"
            }
        });
            expect(response.status()).toBe(400);
            const responseBody = await response.json();
                expect(responseBody.message).toBe("Cannot add book without genre.");
    });

 /* 
    Add similar tests with missing/invalid required parameters (assuming title, author, genre)
    Also repeat with test adding book with review(s) missing rating/comment or both
*/
});
