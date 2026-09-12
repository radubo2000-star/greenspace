-- ============================================
-- GREEN SPACE - MYSQL SCHEMA (AUTH)
-- ============================================
-- Run this on the cPanel MySQL database to set up the auth tables.
-- The users table follows the design from the analysis.

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token_hash VARCHAR(255) NULL,
    verification_expires_at DATETIME NULL,
    reset_token_hash VARCHAR(255) NULL,
    reset_expires_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    session_token_hash CHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    last_used_at DATETIME NULL,
    revoked_at DATETIME NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_sessions_token_hash (session_token_hash),
    KEY idx_sessions_user_id (user_id),
    KEY idx_sessions_expires (expires_at),

    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATA TABLES
-- ============================================
-- Replaces Firebase Realtime Database. Every former Firebase collection
-- gets a dedicated table below (forms, team, gallery, analytics,
-- statistics, home-page testimonials and their per-item metrics).

-- ============================================
-- FORM SUBMISSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS contacts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(254) NOT NULL,
    subject VARCHAR(300) NULL,
    message TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_contacts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS volunteers (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30) NULL,
    age VARCHAR(20) NULL,
    city VARCHAR(200) NULL,
    interests JSON NULL,
    availability VARCHAR(300) NULL,
    experience TEXT NULL,
    motivation TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_volunteers_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS members (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    membership_type VARCHAR(50) NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30) NULL,
    address VARCHAR(300) NULL,
    city VARCHAR(200) NULL,
    cnp VARCHAR(30) NULL,
    occupation VARCHAR(300) NULL,
    motivation TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_members_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partnerships (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    partnership_type VARCHAR(50) NULL,
    company_name VARCHAR(200) NULL,
    contact_person VARCHAR(200) NULL,
    position VARCHAR(200) NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30) NULL,
    website VARCHAR(300) NULL,
    industry VARCHAR(200) NULL,
    employees VARCHAR(50) NULL,
    interests JSON NULL,
    budget VARCHAR(100) NULL,
    description TEXT NULL,
    goals TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_partnerships_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS donations (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    payment_method VARCHAR(50) NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30) NULL,
    message TEXT NULL,
    status VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_donations_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TEAM MEMBERS
-- ============================================

CREATE TABLE IF NOT EXISTS team_members (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(200) NULL,
    email VARCHAR(254) NULL,
    image VARCHAR(500) NULL,
    description TEXT NULL,
    member_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_team_members_order (member_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PAGE VIEWS / ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS page_views (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    path VARCHAR(2048) NOT NULL,
    title VARCHAR(2048) NULL,
    referrer VARCHAR(2048) NULL,
    user_agent VARCHAR(2048) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),
    KEY idx_page_views_created_at (created_at),
    KEY idx_page_views_path (path(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ANNUAL STATISTICS (pagina Statistici + Hero)
-- ============================================

CREATE TABLE IF NOT EXISTS annual_statistics (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    year INT NOT NULL,
    volunteers INT NOT NULL DEFAULT 0,
    trees_planted INT NOT NULL DEFAULT 0,
    projects INT NOT NULL DEFAULT 0,
    events INT NOT NULL DEFAULT 0,
    planting_events INT NOT NULL DEFAULT 0,
    waste_collected INT NOT NULL DEFAULT 0,
    participants INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_annual_statistics_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GALLERY
-- ============================================

CREATE TABLE IF NOT EXISTS gallery_stories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    type VARCHAR(10) NOT NULL DEFAULT 'image',
    url VARCHAR(1000) NOT NULL,
    thumbnail VARCHAR(1000) NULL,
    location VARCHAR(300) NULL,
    title VARCHAR(300) NULL,
    description TEXT NULL,
    display_date VARCHAR(100) NULL,
    timestamp BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_gallery_stories_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_testimonials (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(200) NULL,
    avatar VARCHAR(1000) NULL,
    video_url VARCHAR(1000) NULL,
    thumbnail VARCHAR(1000) NULL,
    title VARCHAR(300) NULL,
    description TEXT NULL,
    duration VARCHAR(50) NULL,
    rating INT NULL,
    timestamp BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_gallery_testimonials_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_before_after (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NULL,
    location VARCHAR(300) NULL,
    display_date VARCHAR(100) NULL,
    before_image VARCHAR(1000) NULL,
    after_image VARCHAR(1000) NULL,
    volunteers INT NOT NULL DEFAULT 0,
    trees_planted INT NOT NULL DEFAULT 0,
    waste_collected INT NOT NULL DEFAULT 0,
    area INT NOT NULL DEFAULT 0,
    timestamp BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_gallery_before_after_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_live_streams (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    description TEXT NULL,
    thumbnail VARCHAR(1000) NULL,
    stream_url VARCHAR(1000) NULL,
    is_live BOOLEAN NOT NULL DEFAULT FALSE,
    scheduled_time DATETIME NULL,
    viewers INT NOT NULL DEFAULT 0,
    duration_hours INT NOT NULL DEFAULT 2,
    timestamp BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_gallery_live_streams_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- HOME-PAGE TESTIMONIALS
-- ============================================

CREATE TABLE IF NOT EXISTS homepage_testimonials (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(200) NULL,
    image VARCHAR(1000) NULL,
    quote TEXT NULL,
    rating INT NOT NULL DEFAULT 5,
    testimonial_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_homepage_testimonials_order (testimonial_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GALLERY METRICS
-- ============================================

-- Story views (one row per story; count stored as a column)
CREATE TABLE IF NOT EXISTS story_views (
    story_id INT UNSIGNED NOT NULL,
    views INT UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (story_id),
    CONSTRAINT fk_story_views_story FOREIGN KEY (story_id)
        REFERENCES gallery_stories (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Likes per video-testimonial per anonymous user
CREATE TABLE IF NOT EXISTS testimonial_likes (
    testimonial_id INT UNSIGNED NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (testimonial_id, user_id),
    CONSTRAINT fk_testimonial_likes_testimonial FOREIGN KEY (testimonial_id)
        REFERENCES gallery_testimonials (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments per video-testimonial
CREATE TABLE IF NOT EXISTS testimonial_comments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    testimonial_id INT UNSIGNED NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(200) NOT NULL DEFAULT 'Utilizator',
    text TEXT NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),
    KEY idx_tcomments_testimonial (testimonial_id),
    CONSTRAINT fk_tcomments_testimonial FOREIGN KEY (testimonial_id)
        REFERENCES gallery_testimonials (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Live-stream viewers (active presence: user joins/leaves)
CREATE TABLE IF NOT EXISTS livestream_viewers (
    stream_id INT UNSIGNED NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (stream_id, user_id),
    CONSTRAINT fk_livestream_viewers_stream FOREIGN KEY (stream_id)
        REFERENCES gallery_live_streams (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Before/After project views
CREATE TABLE IF NOT EXISTS before_after_views (
    project_id INT UNSIGNED NOT NULL,
    views INT UNSIGNED NOT NULL DEFAULT 0,
    stats JSON NULL,

    PRIMARY KEY (project_id),
    CONSTRAINT fk_before_after_views_project FOREIGN KEY (project_id)
        REFERENCES gallery_before_after (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;