"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CategoryPageWrapperProps {
    children: ReactNode;
}

export function CategoryPageWrapper({ children }: CategoryPageWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
