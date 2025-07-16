import fondo from '../../assets/fondo_auth.png';
import logo from '../../assets/blanco.webp';
import {Form} from '@heroui/react'


export default function ChangePassword() {

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
            <Form></Form>
          </div>
        </div>
      </div>
    </div>
  );
}
