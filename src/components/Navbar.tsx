import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav
      className="
        fixed
        w-full
        h-[64px]
        flex
        items-center
        justify-center
        px-4
        sm:px-8
        md:px-16
        lg:px-80
        bg-[#F8F8F8BF]
        z-10
      "
    >
      <div className="text-lg font-bold sm:text-xl">SENETENCE CONSTRUCTION</div>
    </nav>
  );
};

export default Navbar;
