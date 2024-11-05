import { createSignal, onMount } from "solid-js";
import "./DarkMode.css";

function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = createSignal(
        localStorage.getItem("theme") === "dark"
    );

    const handleToggle = () => {
        const newMode = !isDarkMode();
        setIsDarkMode(newMode);
        const theme = newMode ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme); 
    };

    onMount(() => {
        const theme = isDarkMode() ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
    });

    return (
        <label for="theme" class="theme">
            <span class="theme__toggle-wrap">
                <input
                    id="theme"
                    class="theme__toggle"
                    type="checkbox"
                    role="switch"
                    name="theme"
                    value="dark"
                    checked={isDarkMode()}
                    onInput={handleToggle}
                />
                <span class="theme__icon">
                    {[...Array(9)].map((_, index) => (
                        <span class="theme__icon-part"></span>
                    ))}
                </span>
            </span>
        </label>
    );
}

export default ThemeToggle;