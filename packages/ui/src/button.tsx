import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: string;
  onClick : ()=>void
}

type styles = {
  [key:string] : string
}

const style : styles = {
  "default" : "text-white border-white hover:bg-white hover:text-black",
  "primary" : "text-orange-500 border-b-yellow-500 hover:shadow-lg hover:border-t-yellow-500 hover:shadow-orange-700/100",
  "teriary" : ""
}

export const Button = ({ variant, children, onClick }: ButtonProps) => {
  return (
    <button className={ `w-42 ${style[variant??"default"]} p-2 border-2 font-bold  rounded-2xl` }
      onClick = {onClick}
    >
      {children}
    </button>
  );
};


//drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]