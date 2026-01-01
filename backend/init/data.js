// const books = [
//   {
//     Title: "A Brief History of Time",
//     Author: "Stephen Hawking",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$15.99",
//     Category: "Science"
//   },
//   {
//     Title: "The Selfish Gene",
//     Author: "Richard Dawkins",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

//     Price: "$12.99",
//     Category: "Science"
//   },
//   {
//     Title: "The Elegant Universe",
//     Author: "Brian Greene",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$13.99",
//     Category: "Physics"
//   },
//   {
//     Title: "Surely You're Joking, Mr. Feynman!",
//     Author: "Richard P. Feynman",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$10.99",
//     Category: "Physics"
//   },
//   {
//     Title: "Watchmen",
//     Author: "Alan Moore",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$19.99",
//     Category: "Comics"
//   },
//   {
//     Title: "Maus",
//     Author: "Art Spiegelman",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$18.99",
//     Category: "Comics"
//   },
//   {
//     Title: "The Hound of the Baskervilles",
//     Author: "Sir Arthur Conan Doyle",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$14.99",
//     Category: "Mystery"
//   },
//   {
//     Title: "The Hobbit",
//     Author: "J.R.R. Tolkien",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       Price: "$16.99",
//     Category: "Fantasy"
//   },
//   {
//     Title: "The Lord of the Rings",
//     Author: "J.R.R. Tolkien",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$24.99",
//     Category: "Fantasy"
//   },
//   {
//     Title: "The Hitchhiker's Guide to the Galaxy",
//     Author: "Douglas Adams",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$12.99",
//     Category: "Science Fiction"
//   },
  
 
//   {
//     Title: "Pride and Prejudice",
//     Author: "Jane Austen",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$9.99",
//     Category: "Romance"
//   },
//   {
//     Title: "The Catcher in the Rye",
//     Author: "J.D. Salinger",
//     Image:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     Price: "$8.99",
//     Category: "Classic"
//   }
// ];

// module.exports = books;


import { faker } from '@faker-js/faker';
const books=[];
const generateDummyBooks = async (num) => {
    for (let i = 0; i < num; i++) {
      books.push({
        Title: faker.lorem.words(),
        Author: faker.internet.username(),
        Image: faker.image.avatar(),
        Price: faker.commerce.price(),
        Quantity: faker.number.int({ min: 1, max: 100 }),
        ISBN: faker.string.uuid(),
        Language: "English",
        Category: faker.commerce.department(),
        Condition: faker.lorem.word(),
        Pages: faker.number.int({ min: 50, max: 1000 }),
        Publisher: faker.company.name(),
        PublishedYear: faker.date.past({ years: 30 }).getFullYear().toString(),
        Description: faker.lorem.paragraph()
    });
    
        
    }
    
};

generateDummyBooks(50); // Generate 50 dummy books
export default books;