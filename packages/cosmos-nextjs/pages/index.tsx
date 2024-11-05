import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PaperAirplaneIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  const { address } = useAccount();
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">did:health</span>
          </h1>
          <p className="text-center text-lg">
            did:health is a{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              W3C-compliant Decentralized Identifier (DID) solution
            </code>{" "}
            tailored for the healthcare sector. 
          </p>
          <p className="text-center text-lg">
            did:health helps you manage your identity in the healthcare eco-system and provides a bridge to share your idenitity and data is a secure, private manner.
          </p>
          <p className="text-center text-lg">
            Your did:health identifier and your data is interoperable with any health system that support Fast Healthcare Interoperability Resources (FHIR).  
          </p>  
          <p className="text-center text-lg">
            did:health is for all health eco-system participants (Patients, Practitioners, Organizations, and Devices)
          </p>
        </div>

        <div className="flex-grow w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <Link href="/select-did-type">
              <div className="flex flex-col px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg navigation-button">
                <PlusCircleIcon className="h-8 w-8" />
                <p className="text-white">Create Your Identifier</p>
              </div>
            </Link>
            <Link href="/did-document">
              <div className="flex flex-col px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg navigation-button">
                <PaperAirplaneIcon className="h-8 w-8 text-white" />
                <p className="text-white">Share your identity and data</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
