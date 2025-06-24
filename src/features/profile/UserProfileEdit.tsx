import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { UserIcon, MailIcon, LockIcon, XIcon, CheckIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfileEdit({
  userInfo,
  onSave,
  onCancel,
}: {
  userInfo: { name: string; email: string; password: string; avatar: string; role: string };
  onSave: (info: typeof userInfo) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(userInfo);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm(prev => ({ ...prev, avatar: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row w-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                className="pl-10 w-full"
                value={form.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                className="pl-10 w-full"
                type="email"
                value={form.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                className="pl-10 w-full"
                type={showPassword ? "text" : "password"}
                value={form.password} 
                onChange={(e) => handleChange("password", e.target.value)} 
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <CheckIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                color="primary" 
                className="flex items-center"
                onClick={() => onSave(form)}
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                color="danger" 
                variant="light"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="w-full md:w-1/3 bg-gradient-to-br from-green-500 to-blue-500 p-6 md:p-8 flex flex-col items-center justify-center space-y-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <img
            src={form.avatar}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-md"
          />
          <label 
            htmlFor="avatar-upload"
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-white text-sm font-medium">Cambiar</span>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold text-white">{form.name}</h3>
          <span className="inline-block mt-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full">
            {userInfo.role}
          </span>
        </motion.div>

        <div className="w-full mt-6 space-y-3">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Email</h4>
            <p className="text-white text-sm mt-1">{form.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}