const Footer = ({ csvData }: { csvData: string }) => {
  return (
    <footer className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
      <p>Using a dataset of {csvData.split("\n").length - 1} candidates</p>
    </footer>
  );
};

export default Footer;
