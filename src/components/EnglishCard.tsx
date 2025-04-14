import React from "react";

interface EnglishCardProps {
  onStartClick: () => void;
}

const EnglishCard: React.FC<EnglishCardProps> = ({ onStartClick }) => {
  return (
    <div
      className="
        mt-16 /* Added margin-top for initial spacing */
        w-full
        max-w-[627px]
        bg-white
        rounded-lg
        shadow-md
        flex
        flex-col
        items-center
        gap-8
        p-6
        sm:p-8
        md:p-10
        overflow-hidden 
      "
      style={{ height: "hug(72px)" }}
    >
      <h1 className="text-xl font-bold text-center sm:text-2xl md:text-3xl">
        Sentence Construction
      </h1>
      <p className="text-center text-gray-600 text-sm sm:text-base">
        Select the correct words to complete the sentence by arranging the
        provided options in the right order.
      </p>

      <div className="flex justify-around w-full sm:flex-row items-center gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold">Time Per Question</div>
          <div className="text-gray-700">30 sec</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">Total Questions</div>
          <div className="text-gray-700">10</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">Coins</div>
          <div className="text-yellow-500">🟡 0</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mt-4">
        <button
          className="
            w-full
            sm:w-auto
            bg-gray-200
            text-gray-700
            font-semibold
            py-2
            px-4
            rounded-full
            hover:bg-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-gray-400
            text-sm
          "
          onClick={() => {
            // Implement your back navigation logic here if needed in the future
            console.log("Back button clicked");
          }}
        >
          Back
        </button>
        <button
          className="
            w-full
            sm:w-auto
            bg-indigo-600
            text-white
            font-semibold
            py-2
            px-6
            rounded-full
            hover:bg-indigo-700
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500
            text-sm
          "
          onClick={onStartClick}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default EnglishCard;
