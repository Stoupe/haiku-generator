import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="absolute flex h-20 w-full items-center justify-between bg-indigo-100 px-5">
      <span className="text-lg font-bold">Haiku Generator</span>
      {sessionData ? (
        <div>
          <div className="flex items-center gap-2">
            {/* Profile Pic */}
            <div className="relative flex h-10 w-10">
              <Image
                className=" rounded-full"
                fill
                src={sessionData.user.image ?? ""}
                alt="Profile picture"
              />
            </div>
            {/* Name & Email */}
            <div className="flex flex-col">
              <span className="text-md font-bold">
                Welcome, {sessionData.user.name}
              </span>
              <span className="text-md font-light text-gray-700">
                {sessionData.user.email}
              </span>
            </div>

            {/* Sign out button */}
            <button
              type="button"
              className="text-2xl"
              onClick={() => void signOut()}
              aria-label="Sign out"
              title="Sign out"
            >
              ✌️
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="text-lg"
          onClick={() => void signIn("github")}
        >
          Sign in with Github
        </button>
      )}
    </header>
  );
};

export default Header;
