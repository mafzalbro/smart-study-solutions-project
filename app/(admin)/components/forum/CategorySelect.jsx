import { useEffect, useState } from 'react';
import { fetcher } from '@/app/(admin)/utils/fetcher'; // Your fetcher function

const CategorySelect = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <select
      name="category"
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
    >
      <option value="" disabled>Select a category</option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>{category.name}</option>
      ))}
    </select>
  );
};

export default CategorySelect;
