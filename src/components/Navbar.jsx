import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download'; // Import Download Icon

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-6">
      <div className="flex flex-shrink-0 items-center">
        {/* Download CV Button with Download Icon and purple-900 text/icon color */}
        <Button
          startIcon={<DownloadIcon />}
          href="/CV_Junaid Salman_2024.pdf" // Update this to the correct path of your CV
          download="CV_Junaid Salman_2024.pdf"
          variant="text" // Keep background transparent
          sx={{
            color: '#4a148c', // purple-900 color for text and icon
            '& .MuiButton-startIcon': {
              color: '#4a148c', // purple-900 color for icon
            },
            '&:hover': {
              backgroundColor: 'rgba(74, 20, 140, 0.1)', // Add light purple background on hover
            },
          }}
        >
          Download CV
        </Button>
      </div>
      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
        {/* LinkedIn Icon */}
        <a
          href="https://www.linkedin.com/in/junaid-salman-9a6662208/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
        {/* GitHub Icon */}
        <a
          href="https://github.com/Junaid-Salman"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        {/* Instagram Icon */}
        <a
          href="https://www.instagram.com/junaidsalman2121/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
