/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5', // Indigo (Main brand color)
                secondary: '#10B981', // Emerald (Success/Action color)
                dark: '#1F2937', // Dark Gray (Text)
                light: '#F3F4F6', // Light Gray (Backgrounds)
            },
        },
    },
    plugins: [],
}