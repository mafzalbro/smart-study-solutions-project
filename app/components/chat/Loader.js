// export default function Loader() {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );

//   }



import Spinner from "../Spinner";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner />
    </div>
  );
}
