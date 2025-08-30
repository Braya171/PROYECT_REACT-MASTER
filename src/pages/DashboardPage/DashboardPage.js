
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import logo from '../../assets/taller.png';
import userDefault from '../../assets/usuario.avif'; 
import './DashboardPage.css';
import Swal from 'sweetalert2';

function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Determinar foto de usuario
  const userPhoto = user?.photoURL || userDefault;

  // Agregamos el console.log para verificar qué foto se está usando
  console.log(
    user?.photoURL
      ? `Usuario tiene foto: ${user.photoURL}`
      : `Usuario SIN foto, se usará: ${userDefault}`
  );

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Vas a cerrar sesión.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'No, quedarme',
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        sessionStorage.setItem("logout", "true"); 
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: '¡Has cerrado sesión exitosamente!',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/');
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al cerrar sesión.',
        });
      }
    }
  };

  return (
  <>
    {/* CONTENIDO PRINCIPAL */}
    <main className="main-content">
      <div>
        <img src={logo} alt="Logo taller" className="main-logo" />
        <h1 className="welcome-title">Welcome to the mechanics workshop</h1>
        <p className="welcome-text">
          Manage your clients, services, and more efficiently!
        </p>

        <p className="welcome-text">
          <strong>Nombre:</strong> {user?.displayName || "Sin nombre"}
        </p>
        <p className="welcome-text">
          <strong>Email:</strong> {user?.email || "Sin correo"}
        </p>
        <img
          src={userPhoto}
          alt="Foto de usuario"
          className="main-logo"
          style={{ maxWidth: '100px', borderRadius: '50%' }}
        />
      </div>
    </main>
  </>
);
  
}

export default DashboardPage;
