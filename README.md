# PressBlog - A blog CMS website

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

A full-stack Content Management System (CMS) and blogging platform featuring a clean UI and a customized rich-text editor for a better writing experience.

---
## Key Features

* **Advanced Rich-Text Editor:** Used Tiptap with customized UI to make editor easier to use.
  * *Slash Commands:* Notion-style quick formatting menus.
  * *Menu Bar*: Formatting menu for those who don't like *Slash Commands* style. 
* **Robust Authentication:** 
  * Authentication with OTP verification.
  * Google OAuth2 integration.
  * JWT-based stateless session management.
* **Internationalization (i18n):** Fully localized interface supporting both **English** and **Vietnamese**.
* **Tag Management:** Intuitive tagging system integrated with Tagify.
* **Media Handling:** Direct Cloudinary integration for optimized image uploads.

---
## Tech Stack

### Frontend
* **Framework:** Next.js
* **Language:** TypeScript
* **Styling:** Tailwind CSS & shadcn/ui
* **Editor:** Tiptap & Mermaid.js
* **State Management / Data Fetching:** Axios

### Backend
* **Framework:** Spring Boot
* **Security:** Spring Security & OAuth2 Client & JWT
* **Caching:** Redis
* **Database:** PostgreSQL

---
## Roadmap
- [x] Complete JWT & Google OAuth2 Authentication.
- [x] Integrate i18n for En/Vi languages.
- [ ] Overhaul Tiptap Editor with custom extensions - (Mermaid, Syntax Highlighting).
- [ ] Export posts to Markdown/PDF.
- [ ] Add social features (Followers, Real-time Notifications).

---
## License
This project is licensed under the MIT License.