'use client';

import { motion } from 'framer-motion';

export default function ScrollReveal({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            
            viewport={{ once: false, amount: 0.4 }}
            
            className="w-full flex justify-center"
        >
            {children}
        </motion.div>
    );
}