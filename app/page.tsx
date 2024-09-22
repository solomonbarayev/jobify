import Image from "next/image";
import logoSvg from "../assets/logo.svg";
import LandingImg from "../assets/main.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <Image src={logoSvg} alt="logo" />
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center">
        <div>
          <h1 className="capitalize text-4xl md:text-7xl font-bold">
            job <span className="text-primary">tracker</span> app
          </h1>
          <p className="leading-loose max-w-md mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A expedita esse repellendus assumenda alias quo quod?
            Similique dolorum eius eaque quibusdam quisquam, obcaecati recusandae, amet veniam odit facere dolores quaerat!
          </p>
          <Button asChild className="mt-4">
            <Link href="/add-job">Get Started</Link>
          </Button>
        </div>
        <Image src={LandingImg} alt="landing" className="hidden lg:block" />
      </section>
    </main>
  );
}
