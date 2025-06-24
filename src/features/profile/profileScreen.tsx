import { useState } from "react";
import UserProfileView from "./UserProfileView";
import UserProfileEdit from "./UserProfileEdit";
import { SuudaiNavbar } from "../../components";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "Admin User",
        email: "admin@greenhouse.com",
        password: "2412545",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "Administrador"
    });

    const handleSave = (newInfo: typeof userInfo) => {
        setUserInfo(newInfo);
        setIsEditing(false);
    };

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            <SuudaiNavbar/>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.3 }}
                className=" py-8 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isEditing ? "edit" : "view"}
                            initial={{ opacity: 0, x: isEditing ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isEditing ? -20 : 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden bg-[var(--section-color)]"
                            >
                            {isEditing ? (
                                <UserProfileEdit 
                                    userInfo={userInfo} 
                                    onSave={handleSave} 
                                    onCancel={() => setIsEditing(false)} 
                                />
                            ) : (
                                <UserProfileView 
                                    userInfo={userInfo} 
                                    onEdit={() => setIsEditing(true)} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
}