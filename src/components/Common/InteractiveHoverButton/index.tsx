import {motion} from 'framer-motion'
export const InteractiveHoverButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`!h-10 relative inline-flex items-center justify-center px-4 py-3 overflow-hidden font-medium text-white bg-primary rounded-sm group ${className ?? ''}`}
        >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-extra opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition-all duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-extra rounded-full opacity-30 group-hover:rotate-90 ease-out -z-10"></span>
            <span className="relative z-10 flex items-center gap-1">{children}</span>
        </motion.button>
    );
};
