import { useState } from 'react';
import Swal from 'sweetalert2';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './RegisterPage.css';
import logo from '../../assets/usuario.avif';

function RegisterPage() {
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // ✅ Función para validar campo individual
  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value.trim()) {
      return "Este campo es obligatorio";
    }

    switch (name) {
      case "nombres":
      case "apellidos":
        // Valida letras, espacios, y al menos 2 caracteres
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(value)) {
          errorMsg = "Debe escribir un nombre válido (solo letras y al menos 2 caracteres)";
        } else if (/^\s/.test(value)) {
          errorMsg = "No puede iniciar con espacio";
        }
        break;

      case "cedula":
        if (value.length < 7 || value.length > 10) {
          errorMsg = "La cédula debe tener entre 7 y 10 dígitos";
        }
        break;

      case "telefono":
        if (!/^3[0-9]{9}$/.test(value)) {
          errorMsg = "Debe tener 10 dígitos y empezar por 3";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const forbiddenDomains = ["tempmail.com", "mailinator.com", "10minutemail.com"];
        const domain = value.split("@")[1];
        if (!emailRegex.test(value)) {
          errorMsg = "Escribe un correo válido";
        } else if (domain && forbiddenDomains.includes(domain)) {
          errorMsg = "No se permiten correos temporales";
        }
        break;

      case "password":
        if (value.length < 8) {
          errorMsg = "Debe tener al menos 8 caracteres";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])/.test(value)) {
          errorMsg = "Debe incluir mayúsculas, minúsculas, números y símbolos";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          errorMsg = "Las contraseñas no coinciden";
        }
        break;

      default:
        break;
    }

    return errorMsg;
  };

  // ✅ Validación en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // ✅ Filtros de escritura
    if (name === "nombres" || name === "apellidos") {
      newValue = value
        .replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ\s]/g, "") // Solo letras y espacios
        .replace(/\s{2,}/g, " ") // Evita espacios dobles
        .replace(/^\s/, ""); // Elimina espacio al inicio
    }

    if (name === "cedula" || name === "telefono") {
      newValue = value.replace(/[^0-9]/g, ""); // Solo números
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // ✅ Validar en tiempo real
    const errorMsg = validateField(name, newValue);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // ✅ Validar todo antes de enviar
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        ...formData,
        estado: 'pendiente'
      });

      Swal.fire("¡Registro exitoso!", "Usuario registrado correctamente.", "success").then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors(prev => ({ ...prev, email: "Este correo ya está registrado" }));
      } else {
        console.error(error);
        Swal.fire("Error", "No se pudo registrar el usuario.", "error");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
      <div className="form-card">
        <img src={logo} alt="Logo taller" className="logo mb-3 d-block mx-auto" style={{ width: '120px' }} />
        <h3 className="mb-4 text-center">Registro de Usuario</h3>
        <form onSubmit={handleSubmit} noValidate>

          {/* Nombres */}
          <div className="mb-3">
            <label className="form-label">Nombres</label>
            <input
              type="text"
              className="form-control"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Tus nombres"
            />
            {errors.nombres && <small className="text-danger">{errors.nombres}</small>}
          </div>

          {/* Apellidos */}
          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Tus apellidos"
            />
            {errors.apellidos && <small className="text-danger">{errors.apellidos}</small>}
          </div>

          {/* Cédula */}
          <div className="mb-3">
            <label className="form-label">Cédula</label>
            <input
              type="text"
              className="form-control"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="Tu cédula"
            />
            {errors.cedula && <small className="text-danger">{errors.cedula}</small>}
          </div>

          {/* Fecha de nacimiento */}
          <div className="mb-3">
            <label className="form-label">Fecha de Nacimiento</label>
            <input
              type="date"
              className="form-control"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
            {errors.fechaNacimiento && <small className="text-danger">{errors.fechaNacimiento}</small>}
          </div>

          {/* Teléfono */}
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 3001234567"
            />
            {errors.telefono && <small className="text-danger">{errors.telefono}</small>}
          </div>

          {/* Sexo */}
          <div className="mb-3">
            <label className="form-label">Sexo</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexo"
                  value="Masculino"
                  checked={formData.sexo === 'Masculino'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Masculino</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexo"
                  value="Femenino"
                  checked={formData.sexo === 'Femenino'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Femenino</label>
              </div>
            </div>
            {errors.sexo && <small className="text-danger">{errors.sexo}</small>}
          </div>

          {/* Correo */}
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Escribe tu contraseña"
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-3">
            <label className="form-label">Repetir Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
            />
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">Registrar</button>
            <a href="/" className="btn btn-outline-secondary">Volver al inicio</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
