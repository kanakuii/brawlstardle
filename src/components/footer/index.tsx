

export default function Footer() {
  return (
     <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 mt-[20px] mb-[20px] gap-[30px]">
            <a href="https://github.com/kanakuii/brawlstardle">
                <img className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Github.svg"></img>
            </a>
            <img className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Info.svg"></img>
            <img className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Share.svg"></img>
        </div>
      </div>
  );
}