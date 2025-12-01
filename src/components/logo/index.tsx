import Link from "next/link";

export default function Logo() {
    return (
        <Link className="flex justify-center items-center w-full" href="/">
            <img className="w-[25%]" src="/logo.png" alt="logo"/>
        </Link>
    );
}