import UpdateProfile from './UpdateProfile';


export default function UserDetails() {
  
  return (
    <div className="w-full md:w-3/4 h-full p-4 flex flex-col">
      <div className="overflow-y-auto">
          <div className="p-4 rounded-lg text-gray-700 mb-4">
              <UpdateProfile />
          </div>
      </div>
    </div>
  );
}
