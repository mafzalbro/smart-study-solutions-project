export default async function fetchBooksData() {
  try {
      const response = await fetch('http://localhost:3000/api/books?limit=20'); //page = 1, limit = 5
      if (!response.ok) {
          throw new Error(`Error fetching books: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(data);
      return data.data;
  } catch (error) {
      console.error('Error fetching books:', error);
      throw error; // Re-throw for potential error handling in the calling component
  }
}
