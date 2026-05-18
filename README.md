# 🌌 DreamVault

DreamVault is a modern AI-powered knowledge and memory platform designed to help users store, organize, search, and interact with their digital thoughts, notes, conversations, and documents intelligently.

Built with scalability and developer experience in mind, DreamVault combines modern full-stack technologies with AI-driven workflows to create a seamless second-brain experience.

---

## ✨ Features

* 🧠 AI-powered knowledge retrieval
* 📂 Smart document & note organization
* 🔍 Semantic search and contextual memory
* ⚡ Fast and responsive UI
* 🔐 Authentication & secure user sessions
* ☁️ Cloud-ready architecture
* 📱 Fully responsive modern design
* 🗄️ Database-driven persistent storage

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Prisma ORM
* PostgreSQL

### Authentication

* NextAuth.js

### AI / Intelligence

* OpenAI APIs
* Vector search & embeddings (planned/integrated)

---

## 📸 Preview

Add screenshots or GIFs here.

```md
![Dashboard Preview](./public/preview.png)
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NamanSharma2112/DreamVault.git
cd DreamVault
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dreamvault?schema=public"

NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

### 4. Setup Prisma

```bash
npx prisma generate
npx prisma db push
```

---

### 5. Run the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## 📂 Project Structure

```bash
DreamVault/
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── styles/
├── types/
└── utils/
```

---

## 🧩 Future Roadmap

* [ ] AI chat memory
* [ ] Multi-model AI support
* [ ] Vector database integration
* [ ] Voice-based interaction
* [ ] Real-time collaboration
* [ ] Browser extension
* [ ] Mobile application

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Made with ❤️ by Naman Sharma

* Portfolio: https://namansharma.com
* GitHub: https://github.com/NamanSharma2112

---

## ⭐ Support

If you like this project, consider giving it a star on GitHub ⭐
