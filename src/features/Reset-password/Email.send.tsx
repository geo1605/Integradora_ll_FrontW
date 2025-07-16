import fondo from '../../assets/fondo_auth.png';
import logo from '../../assets/blanco.webp';
import { Form, Input, Button } from '@heroui/react';
import { useState } from 'react';
import { requestPasswordReset } from '../../api/Email';
import AlertModal from '../../components/alerts'; // Ajusta la ruta si tu modal está en otra carpeta

export default function EmailSend() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setModalError(null);

    try {
      const res = await requestPasswordReset(email);
      setModalError(null);
      setModalOpen(true);
    } catch (err: any) {
      setModalError(err.message || 'Ocurrió un error.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="min-h-screen w-full backdrop-blur-sm bg-black/40 flex flex-col items-center justify-start px-4">
        <div className="text-center w-full max-w-md">
          <div className="flex flex-row items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 mb-2" />
            <div className="ml-4 text-white">
              <h1 className="text-2xl font-bold">SUDAAI</h1>
              <h2 className="text-lg font-semibold">ACUAPONIA</h2>
            </div>
          </div>

          <div className="rounded-lg shadow-lg p-5 w-full max-w-md bg-[var(--section-color)]">
            <Form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Recuperar contraseña</h3>
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="Ingresa tu correo"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" color="success" className="w-full" isLoading={loading}>
                Enviar código
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        title={modalError ? "Error" : "Correo enviado"}
        message={
          modalError
            ? modalError
            : "Se ha enviado un correo con instrucciones para restablecer tu contraseña."
        }
        confirmText="Aceptar"
        showCancelButton={false}
      />
    </div>
  );
}
