import Link from "next/link";

export default function Logo() {
    return (
        <Link className="flex justify-center items-center w-screen" href="/">
            <img className="w-[30%]" src="/logo.png" alt="logo"/>
        </Link>
    );
}