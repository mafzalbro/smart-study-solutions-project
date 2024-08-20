"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import ClickButton from '../ClickButton';
import CustomSelect from './CustomSelect';
import Link from 'next/link';
import structure from '@/app/lib/bs_syllabus_metadata.js';
import { FaFile, FaBook, FaStickyNote } from 'react-icons/fa';

const SideArea = ({ sortBy, handleSortChange, filterBy, handleFilterChange }) => {
  const isMediumScreen = useMediaQuery({ minWidth: 768 });
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubDir, setSelectedSubDir] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize the state based on the URL
    const pathParts = pathname.split('/').filter(part => part); // Remove empty parts
    if (pathParts[1]) {
      const degree = pathParts[1].toUpperCase();
      const degreeData = structure.find(d => d.name.toUpperCase() === degree);
      if (degreeData) {
        setSelectedDegree(degree);

        if (pathParts[2]) {
          const semester = pathParts[2].replace('-', ' ').toUpperCase();
          const semesterData = degreeData.subDirs.find(s => s.name.toUpperCase() === semester);
          if (semesterData) {
            setSelectedSemester(semester);

            if (pathParts[3]) {
              const subDir = pathParts[3].replace('-', ' ').toUpperCase();
              const subDirExists = semesterData.subDirs.some(sub => sub.name.toUpperCase() === subDir);
              if (subDirExists) {
                setSelectedSubDir(subDir);
              }
            }
          }
        }
      }
    }
  }, [pathname]);

  const handleDegreeChange = (degree) => {
    setSelectedDegree(degree);
    setSelectedSemester(null);
    setSelectedSubDir(null);
    router.push(`/resources/${degree.toLowerCase()}`);
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    setSelectedSubDir(null);
    if (selectedDegree) {
      router.push(`/resources/${selectedDegree.toLowerCase()}/${semester.toLowerCase().replace(' ', '-')}`);
    }
  };

  const degreeData = structure.find(degree => degree.name.toUpperCase() === (selectedDegree || '').toUpperCase());
  const semesterData = degreeData?.subDirs.find(semester => semester.name.toUpperCase() === (selectedSemester || '').toUpperCase());

  const getIconForSubDir = (name) => {
    switch(name.toLowerCase()) {
      case 'past papers':
        return <FaFile />;
      case 'books':
        return <FaBook />;
      case 'notes':
        return <FaStickyNote />;
      default:
        return null;
    }
  };

  return (
    <aside className={`mb-10 md:mb-0 rounded-lg ${isMediumScreen ? 'w-40 h-screen sticky top-0' : 'w-full md:w-40 mt-4 md:mt-0'}`}>
      {/* <ClickButton className="py-2 px-4 mb-4 bg-transparent hover:bg-transparent dark:hover:bg-transparent dark:bg-transparent text-center text-accent-500 hover:text-accent-600 shadow-none" text='Clear All' onClick={() => window.location.reload()} /> */}
      <div className="space-y-4">
        <CustomSelect
          label="Select Degree Program"
          options={structure.map(degree => degree.name)}
          selectedOption={selectedDegree}
          onOptionChange={handleDegreeChange}
        />
        {selectedDegree && (
          <CustomSelect
            label="Select Semester"
            options={degreeData.subDirs.map(semester => semester.name)}
            selectedOption={selectedSemester}
            onOptionChange={handleSemesterChange}
          />
        )}
        {selectedDegree && selectedSemester && semesterData && (
          <div className="mt-2 space-y-2">
            {semesterData.subDirs.map((subDir, index) => (
              <div key={index} className="flex items-center">
                <Link href={`/resources/${selectedDegree.toLowerCase()}/${selectedSemester.toLowerCase().replace(' ', '-')}/${subDir.name.toLowerCase().replace(' ', '-')}`}>
                  <div className={`flex items-center gap-2 p-2 ${selectedSubDir === subDir.name.toUpperCase() ? 'text-accent-600 dark:text-accent-400' : 'dark:hover:text-neutral-200 hover:text-neutral-600'}`}>
                    {getIconForSubDir(subDir.name)}
                    {subDir.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideArea;
