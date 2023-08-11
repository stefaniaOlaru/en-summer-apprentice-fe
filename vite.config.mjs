import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    proxy: {
      "/api/Event/GetAll": {
        target: "https://localhost:7069",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
