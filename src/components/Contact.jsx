import { useState } from "react";
import { CONTACT } from "../constants";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "./Modal";
import ContactForm from "./ContactForm";

const EMPTY_SNACKBAR = { open: false, variant: "success", message: "" };

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(EMPTY_SNACKBAR);

  return (
    <div className="border-b border-neutral-900 pb-20">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl">Get in Touch</motion.h1>

      <div className="text-center tracking-tighter">
        <motion.p
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 1 }}
          className="my-4"> {CONTACT.address} </motion.p>

        <motion.p
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 1 }}
          className="my-4"> {CONTACT.phoneNo} </motion.p>

        <a href={`mailto:${CONTACT.email}`} className="border-b">
          {CONTACT.email}
        </a>
      </div>

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mx-auto mt-12 flex max-w-xl justify-center">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-500"
        >
          Send a Message
        </button>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send a Message">
        <ContactForm
          onResult={(variant, message) => {
            setSnackbar({ open: true, variant, message });
            if (variant === "success") {
              setIsModalOpen(false);
            }
          }}
        />
      </Modal>

      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        aria-live="polite"
      >
        <Alert
          role="status"
          severity={snackbar.variant}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
};

export default Contact;
