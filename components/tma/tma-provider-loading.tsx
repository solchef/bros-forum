import { Loader } from "@/components/loader";
import Image from "next/image";
import gitLoader from "@/public/logo.svg"; // Import the Git loader image

export function TmaProviderLoading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {/* Git loader image */}
      <Image 
        src={gitLoader}
        alt="Git Loader"
        width={100}  // Adjust the width as per your needs
        height={100} // Adjust the height as per your needs
        className="mb-4"
      />

      {/* Larger Spinner Loader */}
      <div className="flex text-muted-foreground gap-2 text-sm items-center">
        {/* <Loader className="w-16 h-16" /> */}
        <center>
        <h5>Broscams Forum MiniApp is temporarily under maintenance and will be in a short while.</h5>
         {/* Adjust size of Loader */}
         </center>
      </div>
    </div>
  );
}
