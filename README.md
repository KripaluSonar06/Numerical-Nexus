# 📘 Numerical Nexus – Interactive Numerical Methods Learning Platform

Numerical Nexus is a full–stack, interactive learning environment designed to help students and developers explore **Numerical Methods** through real-time computation, live streaming outputs, visualizations, and intuitive UI components.
It combines a modern React-based frontend with a FastAPI backend to provide an immersive and high-performance learning experience.

---

## 🚀 Features

### 🔹 **1. Real-Time Streaming Computation (FastAPI)**

* Backend solves numerical methods problems such as:

  * Harshad number problems
  * Legendre polynomials
  * Companion matrices
  * LU decomposition
  * Eigenvalue-based root finding
  * Newton–Raphson refinement
  * Gauss–Legendre collocation
  * Temperature profile PDE calculations
* Results are streamed *line-by-line* to the frontend terminal for a real “program execution” feel.

### 🔹 **2. Interactive Terminal UI**

* Custom-built terminal emulator with:

  * Typing animation
  * Real-time streaming updates
  * Color-coded logs
  * Activity cursor

### 🔹 **3. Smart File Handling (CSV, PNG, PDF)**

* Backend auto-generates output files for:

  * Polynomial coefficients
  * Companion matrices
  * Root lists
  * LU solutions
  * Error matrices
  * Temperature profile plots
* Frontend dynamically fetches and renders:

  * CSV as interactive tables
  * PNG as images
  * PDF as document viewer

### 🔹 **4. Question-based Navigation**

* Students navigate assignments:

  * Assignment → Question → Input → Live Output
* Every question has:

  * Input panel
  * Terminal output
  * CSV/Image viewers
  * Expandable “Show Code” section
  * Completion tracking

### 🔹 **5. Modern Aesthetic UI**

* Built using:

  * React 18
  * TailwindCSS + shadcn/ui
  * Framer Motion
  * Glass morphism styling
  * Keyboard click sound feedback
* Smooth animations and clean layout designed for academic usage.

### 🔹 **6. AI Chatbot Powered by Gemini**

* Integrated floating chatbot available on all pages
* Uses Google Gemini API (free tier)
* Helps with:

  * Numerical method explanations
  * Step-by-step guidance
  * Debugging code
  * Mathematical intuition

### 🔹 **7. Additional Tools**

* Interactive τ-Slider for PDE visualization
* 3D/2D plots for assignment simulations
* Tab-based results segregation
* Streaming-safe backend with non-cached file outputs

---

## 🏗️ Tech Stack

### **Frontend**

* React + TypeScript
* Vite
* TailwindCSS
* shadcn/ui components
* React Router
* Framer Motion
* CSV & Image viewers
* Gemini chatbot

### **Backend**

* FastAPI
* Python Numerical Libraries:

  * NumPy
  * SciPy
  * matplotlib
  * numpy.polynomial
* Real-time StreamingResponse
* CSV/PNG writers
* LU decomposition & eigenvalue solvers

---

## 📂 Project Structure

```
Numerical-Nexus/
│
├── frontendK/        # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── assets/
│   │   └── App.tsx
│
├── backendT/         # FastAPI backend
│   ├── app/
│   │   ├── solutions/
│   │   ├── schemas.py
│   │   ├── main.py
│   │   └── output/   # Auto-generated CSV/PNG
│
└── README.md
```

---

## ▶️ Running the Project

### **Start Backend**

```
cd backendT
uvicorn app.main:app --reload
```

### **Start Frontend**

```
cd frontendK
npm install
npm run dev
```

Both must run simultaneously.


## 🎯 Vision & Goal

This platform is built to help students understand **Numerical Methods not by reading**, but by **seeing**, **experimenting**, and **interacting** with the algorithms live.

It turns complex numerical computations into:

* Visual
* Intuitive
* Streamed
* Hands-on

A perfect tool for learning, teaching, and experimenting.
