// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // pages 디렉토리 내의 모든 JS, TS, JSX, TSX 파일
    "./components/**/*.{js,ts,jsx,tsx}", // components 디렉토리 내의 파일들
    "./app/**/*.{js,ts,jsx,tsx}", // Next.js 13 이상일 경우 app 디렉토리 사용
    "./src/**/*.{js,ts,jsx,tsx}", // src 디렉토리를 사용하는 경우
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
