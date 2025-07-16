import { Button } from "@heroui/react";
import { UserIcon, MailIcon, LockIcon, PhoneIcon, EditIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfileView({
  userInfo,
  onEdit,
}: {
  userInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: string;
  };
  onEdit: () => void;
}) {
  const fullName = [userInfo.firstName, userInfo.middleName, userInfo.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full p-6 md:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>

        <div className="space-y-5">
          <div className="flex items-center p-3">
            <UserIcon className="mr-3 text-green-600 h-5 w-5" />
            <div>
              <p className="text-xs font-medium">Nombre</p>
              <p>{fullName}</p>
            </div>
          </div>

          <div className="flex items-center p-3">
            <MailIcon className="mr-3 text-green-600 h-5 w-5" />
            <div>
              <p className="text-xs font-medium">Email</p>
              <p>{userInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center p-3">
            <PhoneIcon className="mr-3 text-green-600 h-5 w-5" />
            <div>
              <p className="text-xs font-medium">Teléfono</p>
              <p>{userInfo.phoneNumber || "No registrado"}</p>
            </div>
          </div>

          <div className="flex items-center p-3">
            <LockIcon className="mr-3 text-green-600 h-5 w-5" />
            <div>
              <p className="text-xs font-medium">Contraseña</p>
              <p>••••••••</p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="pt-2">
            <Button color="primary" className="flex items-center" onClick={onEdit}>
              <EditIcon className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
