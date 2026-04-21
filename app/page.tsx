import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClientLogos } from "@/components/ClientLogos";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { About } from "@/components/About";
import { JobListings } from "@/components/JobListings";
import { CtaBanner } from "@/components/CtaBanner";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { getJobs } from "@/lib/jobs";

export const revalidate = 3600;

export default async function Home() {
  const jobs = await getJobs();

  return (
    <>
      <JsonLd jobs={jobs} />
      <Navbar />
      <main>
        <Hero jobs={jobs} />
        {/* <ClientLogos /> */}
        <Services />
        <WhyUs />
        <About />
        <JobListings jobs={jobs} />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
