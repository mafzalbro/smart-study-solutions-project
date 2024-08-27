import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';

export default function SidebarToggleButton({ isSidebarVisible, toggleSidebar }) {
  return (
    <button
      onClick={toggleSidebar}
      className={`fixed z-20 transition-all ease-in-out duration-400 rounded-full m-2 md:m-4 p-2 dark:text-accent-50 dark:bg-primary bg-accent-50 text-primary mt-2 ${!isSidebarVisible ? 'left-0' : 'left-[59%]'} bottom-20 md:hidden`}
    >
      {isSidebarVisible ? <MdOutlineArrowBackIosNew /> : <MdOutlineArrowForwardIos />}
    </button>
  );
}
