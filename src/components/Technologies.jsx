import { RiReactjsLine } from "react-icons/ri";
import { TbBrandNextjs } from "react-icons/tb";
import { SiMongodb, SiPython } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { DiMysql, DiCode, DiUnitySmall } from "react-icons/di";
import { motion } from "framer-motion";

const iconVariants = (duration) => ({
    initial: { y: -10 },
    animate: {
        y: [10, -10],
        transition: {
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
        },
    },
});

const Technologies = () => {
  return (
    <div className="border-b border-neutral-800 pb-24">
        <motion.h1
            whileInView={{opacity:1, y:0}}
            initial={{opacity:0, y: -100}}
            transition={{duration: 1.5}}
            className="my-20 text-center text-4xl">Technologies</motion.h1>
        <motion.div 
            whileInView={{opacity:1, x:0}}
            initial={{opacity:0, x:-100}}
            transition={{duration:1.5}}
            className="flex flex-wrap items-center justify-center gap-4">

            <motion.div 
                variants={iconVariants(2.5)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <RiReactjsLine className="text-6xl text-cyan-400" /> {/* Changed to text-6xl */}
            </motion.div>

            <motion.div 
                variants={iconVariants(3)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <TbBrandNextjs className="text-6xl" /> {/* Changed to text-6xl */}
            </motion.div>

            <motion.div 
                variants={iconVariants(5)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <SiMongodb className="text-6xl text-green-500" /> {/* Changed to text-6xl */}
            </motion.div>

            <motion.div 
                variants={iconVariants(2)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <SiPython className="text-6xl text-yellow-500" /> {/* Changed to text-6xl */}
            </motion.div>

            <motion.div 
                variants={iconVariants(6)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <FaNodeJs className="text-6xl text-green-500" /> {/* Changed to text-6xl */}
            </motion.div>

            <motion.div 
                variants={iconVariants(4)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <DiMysql className="text-6xl text-blue-500" /> {/* Changed to text-6xl */}
            </motion.div>

            <motion.div 
                variants={iconVariants(3.5)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <DiUnitySmall className="text-6xl text-white" /> {/* Changed to text-6xl */}
            </motion.div>

            <motion.div 
                variants={iconVariants(5)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                <DiCode className="text-6xl text-gray-700" /> {/* Changed to text-6xl */}
            </motion.div>
        </motion.div>
    </div>
  )
};

export default Technologies;
