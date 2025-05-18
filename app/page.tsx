import fs from "fs";
import path from "path";
import ChatInterface from "@/components/ChatInterface";
import Footer from "@/components/Footer";

export function generateMetadata() {
  return {
    title: "Candidate Search",
    description: "AI-powered candidate search and filtering",
  };
}

export default function Home() {
  const csvPath = path.join(process.cwd(), "data/candidates.csv");
  const csvData = fs.readFileSync(csvPath, "utf8");

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-h-screen">
      <div
        suppressHydrationWarning={true}
        className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <ChatInterface candidatesData={csvData} />
      </div>

      <Footer csvData={csvData} />
    </div>
  );
}
