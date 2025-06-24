import { Button } from "@heroui/react";
import { UserIcon, MailIcon, LockIcon, EditIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfileView({
  userInfo,
  onEdit,
}: {
  userInfo: { name: string; email: string; password: string; avatar: string; role: string };
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col-reverse md:flex-row w-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
        
        <div className="space-y-5">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <UserIcon className="mr-3 text-green-600 h-5 w-5" />
            <div>
              <p className="text-xs font-medium text-gray-500">Nombre</p>
              <p className="text-gray-800">{userInfo.name}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <MailIcon className="mr-3 text-green-600 h-5 w-5" />
            <div>
              <p className="text-xs font-medium text-gray-500">Email</p>
              <p className="text-gray-800">{userInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <LockIcon className="mr-3 text-green-600 h-5 w-5" />
            <div>
              <p className="text-xs font-medium text-gray-500">Contraseña</p>
              <p className="text-gray-800">{userInfo.password}</p>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button 
              color="primary" 
              className="flex items-center"
              onClick={onEdit}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="w-full md:w-1/3 bg-gradient-to-br from-green-500 to-blue-500 p-6 md:p-8 flex flex-col items-center justify-center space-y-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img
            src={userInfo.avatar}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-md"
          />
        </motion.div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white">{userInfo.name}</h3>
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block mt-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full"
          >
            {userInfo.role}
          </motion.span>
        </div>

        <div className="w-full mt-6 space-y-3">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white bg-opacity-20 rounded-lg p-3"
          >
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Email</h4>
            <p className="text-white text-sm mt-1">{userInfo.email}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}