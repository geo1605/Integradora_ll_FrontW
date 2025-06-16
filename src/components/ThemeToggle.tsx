import { useTheme } from '../contexts/themeContext';



const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Cambiar a {theme === 'light' ? 'oscuro' : 'claro'}
    </button>
  );
};

export default ThemeToggle;
