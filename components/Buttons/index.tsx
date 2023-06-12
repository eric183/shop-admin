import clsx from "clsx";

interface ICommonButton {
  className?: string;
  onClick?: (arg?: any) => void;
  children: React.ReactNode;
}

export const GradientButton = ({
  onClick,
  children,
  className = "",
}: ICommonButton) => {
  return (
    <button
      onClick={() => onClick && onClick()}
      className={clsx({
        [className]: className,
        "relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden":
          true,
        "text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br !cursor-pointer":
          true,
        "from-cyan-500 to-blue-500 group-hover:from-cyan-500": true,
        "group-hover:to-blue-500 hover:text-white dark:text-white dark:focus:ring-cyan-800":
          true,
        "focus:ring-4 focus:outline-none focus:ring-cyan-200": true,
      })}
    >
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        {children}
      </span>
    </button>
  );
};
