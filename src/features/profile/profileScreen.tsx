import { useState, useEffect } from "react";
import UserProfileView from "./UserProfileView";
import UserProfileEdit from "./UserProfileEdit";
import { motion, AnimatePresence } from "framer-motion";
import { useUserId } from "../../hooks/useUserId";
import { useAuthStore } from "../../store/auth.store";
import { getUserDataById, updateUserData } from "../../api/Users";
import Loader from "../../components/loader";

interface UserInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  password?: string;
}

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const userId = useUserId();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) {
        setError("No se pudo obtener la información del usuario");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userData = await getUserDataById(userId, token);

        setUserInfo({
          firstName: userData.firstName ?? "",
          middleName: userData.middleName ?? "",
          lastName: userData.lastName ?? "",
          email: userData.email ?? "",
          phoneNumber: userData.phoneNumber ?? "",
          role: userData.role ?? "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleSave = async (newInfo: UserInfo) => {
    try {
      setIsLoading(true);
      if (!token) throw new Error("No hay token de autenticación");

      const updateData = {
        email: newInfo.email,
        phoneNumber: newInfo.phoneNumber,
        newPassword: newInfo.password,
        currentPassword: newInfo.password,
        firstName: newInfo.firstName,
        middleName: newInfo.middleName,
        lastName: newInfo.lastName,
      };

      await updateUserData(token, updateData);
      setUserInfo(newInfo);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating user data:", err);
      setError(err instanceof Error ? err.message : "Error al actualizar los datos del usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4 rounded-lg bg-red-50">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.3 }}
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? "edit" : "view"}
            initial={{ opacity: 0, x: isEditing ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isEditing ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl shadow-lg overflow-hidden bg-[var(--section-color)]"
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
  );
}
