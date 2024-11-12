import GetStartedButtons from "../GetStartedButtons";
import StylishTitle from "../StylishTitle";

const AnnouncementHardCoded = () => {
  // Hardcoded content for the announcement
  const data = {
    image: "/home/header.png", // Hardcoded image path
  };

  return (
    <>
      <div className="relative flex flex-col md:flex-row min-h-[80vh] md:h-[80vh] w-full overflow-hidden mb-4">
        {/* Content Section */}
        <div className="md:mx-4 md:w-1/2 text-center md:text-left flex items-center mx-8">
          <div>
            <StylishTitle
              colored="The Ultimate Destination "
              addBr
              simple="for Your Smart Studies!"
            />

            <div className="text-base w-5/6 md:mx-0 inline-block my-5">
              Here you'll find all the solutions about your study problems!
              <span className="mt-4 md:mt-8 block">
                <GetStartedButtons />
              </span>
            </div>
          </div>
        </div>

        {/* Full Background Image Section */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 blur-md"
          style={{
            backgroundImage: `url(${data.image})`,
            zIndex: -1, // Place the full background image behind the content
          }}
        ></div>

        {/* Image Section (Visible as Content Image) */}
        <div className="w-full md:w-1/2 h-full flex justify-center items-center p-8">
          <img
            src={data.image}
            alt="Announcement"
            className="w-full md:h-full md:object-cover rounded-xl"
          />
        </div>
      </div>
    </>
  );
};

export default AnnouncementHardCoded;
