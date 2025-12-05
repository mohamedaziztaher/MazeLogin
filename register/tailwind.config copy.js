/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // NIRD Color Palette
                nird: {
                    blue: '#2563EB',      // N - Numérique (Blue)
                    purple: '#9333EA',    // I - Inclusif (Purple)
                    pink: '#EC4899',      // R - Responsable (Pink)
                    yellow: '#FBBF24',    // D - Durable (Yellow)
                },
                primary: '#2563EB', // NIRD Blue
                secondary: '#9333EA', // NIRD Purple
                accent: '#EC4899', // NIRD Pink
                highlight: '#FBBF24', // NIRD Yellow
            },
        },
    },
    plugins: [],
}
