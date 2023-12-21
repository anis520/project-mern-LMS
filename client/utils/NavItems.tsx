import Link from "next/link";
import React from "react";
type navobj = {
  name: string;
  url: string;
};
export const navItemsData: navobj[] = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type Props = { activeItem: number; isMobile: boolean };

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData &&
          navItemsData.map((i, index) => (
            <Link
              href={`${i.url}`}
              key={index}
              passHref
              className={`
                ${
                  activeItem == index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                }
                 text-[18px] px-6  font-Poppins font-[400]`}
            >
              <span>{i.name}</span>
            </Link>
          ))}
      </div>

      {isMobile && (
        <div
          className="800px:hidden my-5  flex
        flex-col gap-6 "
        >
          <div className="w-full text-center py-6">
            <Link href={"/"} passHref>
              <span
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                Testing
              </span>
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((i, index) => (
              <Link href={`${i.url}`} key={index} passHref>
                <span
                  className={`${
                    index == activeItem
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } text-[18px] px-6 py-5 font-Poppins font-[400]`}
                >
                  {i.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
