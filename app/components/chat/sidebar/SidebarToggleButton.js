import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';

export default function SidebarToggleButton({ isSidebarVisible, toggleSidebar }) {
  return (
    <button
      onClick={toggleSidebar}
      className={`fixed z-20 transition-all ease-in-out duration-200 rounded-full m-4 p-2 bg-accent-50 text-primary mt-2 ${!isSidebarVisible ? 'left-0' : 'left-[55%]'} md:hidden`}
    >
      {isSidebarVisible ? <MdOutlineArrowBackIosNew /> : <MdOutlineArrowForwardIos />}
    </button>
  );
}
