<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

A Schools Management System API that is designed to streamline the management of schools. This comprehensive system empowers schools, teachers, students, and administrators to efficiently manage various aspects of the educational process.

<!-- FEATURES -->
## Features

The Schools Management System API is a comprehensive solution designed to streamline educational authorities' administrative tasks, ensuring efficient management and control. The system serves two primary actors.

- School
  - **Register as a School:**
    allow new educational authorities to create a school profile and super school admin for them.

  - **Login as a School Admin (Super, Normal):**
    school administrators can have different levels of access: super school admin with extended privileges and normal admin.

  - **Retrieve the School of the current active School Admin:**
    fetch the school associated with the currently logged-in school admin.

  - **Retrieve the current School Admin:**
    fetch information about the currently logged-in school admin.

  - **Add School Admins (Normal):**
    super school admins can add new school admins with regular access privileges.

  - **Retrieve Admins of a School (List of Admins):**
    fetch a list of administrators assigned to a specific school.
  
  - **Retrieve a specific Admin of a School:**
    fetch info about a specific school administrator within a school.

  - **Remove a School Admin (Super School Admin Privilege Required):**
    allow super school admin to revoke admin privileges from other administrators.

  - **Update School details**.

  - **Add classrooms**.

  - **Retrieve classrooms of my School**.

  - **Add Students**.

  - **Remove Students**.

- Student
  - **Retrieve my classroom mates**.

  - **Retrieve classrooms of my School**.

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

You need to have Node.js, MongoDB and Redis installed.

### Installation

1. Clone this repository: `git clone https://github.com/DrNykterstien/schools-management-api`
2. Install the dependencies: `npm install`
3. Setup your MongoDB database
4. Add environment variables that the app will need to the `.env` file in the root directory of the project.
5. Start the server in production mode `npm start` or for development mode you can use `npm run dev`
