# whoare 🚀

**whoare** is a full-stack face recognition platform that allows users to **capture or upload images**, process them using an AI worker, and store **embeddings in MySQL**. Built with **Next.js**, **Python worker**, **RabbitMQ**, and **Docker**, it is designed for **scalable AI workflows**.

---

## Features

* Live **webcam capture** and **image upload**
* Async **AI face processing** with Python worker
* Store embeddings and status in **MySQL**
* Polling for processing status
* Fully **Dockerized** for easy deployment
* Ready for future **AI recognition / search integration**

---

## Architecture

```
Next.js Client  --->  Next.js API  --->  RabbitMQ Queue  --->  Python Worker  --->  MySQL
(webcam/upload)      (upload route)          (job queue)         (face embeddings)   (store results)
```

* **Frontend:** Next.js SPA for capture and upload
* **API:** Next.js API routes for uploading images and fetching face status
* **Worker:** Python service using **MTCNN + FaceNet** for embeddings
* **Database:** MySQL for storing faces, embeddings, and statuses
* **Queue:** RabbitMQ decouples API from heavy AI tasks

---

## Prerequisites

* **Windows 10/11 or Linux/macOS**
* **Docker Desktop** (with Docker Compose)
* **Node.js >= 18**
* **Python 3.10+** (for worker)

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/paswans05/whoare.git
cd whoare
```

2. **Dockerized Setup**

* Build and run all services:

```bash
docker compose up --build
```

* Access:

  * Next.js client: `http://localhost:3000`
  * RabbitMQ Management: `http://localhost:15672` (user: guest / pass: guest)
  * MySQL: port `3306`

> ⚠️ Make sure Docker Desktop is running before executing the command.

3. **Manual Setup (Optional)**

* Install dependencies for client:

```bash
cd client
npm install
npm run dev
```

* Install Python worker dependencies:

```bash
cd worker
pip install -r requirements.txt
```

* Start RabbitMQ and MySQL separately if not using Docker.

---

## Folder Structure

```
whoare/
├── client/        # Next.js frontend + API
├── worker/        # Python AI worker
├── db/            # MySQL schema
├── uploads/       # Uploaded images
├── docker-compose.yml
├── README.md
```

---

## Usage

1. Open **[http://localhost:3000](http://localhost:3000)**
2. **Capture a photo** using webcam or **upload an image**
3. Click **Upload**
4. The backend will **process the image asynchronously**
5. Polling will update **status** and **embedding info**

---

## Database Schema

MySQL table `faces`:

| Column     | Type               | Description                        |
| ---------- | ------------------ | ---------------------------------- |
| id         | INT AUTO_INCREMENT | Primary key                        |
| user_id    | VARCHAR(36)        | Optional user identifier           |
| file_path  | TEXT               | Path to uploaded image             |
| status     | ENUM               | pending, processed, error, no_face |
| embedding  | JSON               | Face embedding vector              |
| created_at | TIMESTAMP          | Record creation time               |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push branch: `git push origin feature/your-feature`
5. Create a Pull Request

---

## License

MIT License © 2025 Sanjay Paswan
