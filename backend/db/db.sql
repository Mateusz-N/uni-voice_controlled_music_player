-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 31 Sty 2024, 19:53
-- Wersja serwera: 10.4.24-MariaDB
-- Wersja PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `praca_inzynierska`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `connection`
--

CREATE TABLE `connection` (
  `access_token` varchar(511) COLLATE utf8_polish_ci NOT NULL,
  `refresh_token` varchar(511) COLLATE utf8_polish_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8_polish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `playlist`
--

CREATE TABLE `playlist` (
  `id` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `description` text COLLATE utf8_polish_ci NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `public` tinyint(1) NOT NULL,
  `collaborative` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `playlist`
--

INSERT INTO `playlist` (`id`, `name`, `description`, `thumbnail`, `public`, `collaborative`) VALUES
('73ePdN4qDLhrYB7doZ6d3y', '(Mostly) Instrumentals', '', 'https://mosaic.scdn.co/640/ab67616d0000b27326e6b6f666ef40b6b8365e3eab67616d0000b273368e8b47321e322159b8fde1ab67616d0000b2737c05e69390ab7c628a83cee7ab67616d0000b273f399efa20097105e9db88560', 0, 0),
('7KZQhwoqjOKFIZJfyYDKzd', 'Unknown playlist', '', 'https://mosaic.scdn.co/640/ab67616d0000b273164feb363334f93b6458d2a9ab67616d0000b27359b8b957f164ce660919f1f4ab67616d0000b273e4c3db3e7ebfc22bc080f334ab67616d0000b273f60070dce96a2c1b70cf6ff0', 0, 0),
('7pF0Uqvn7dimX5hGpWm5q2', 'Dark', '', 'https://mosaic.scdn.co/640/ab67616d0000b27396a926d07aea417327ea024aab67616d0000b273a4c79ec8f98d1866d266f5afab67616d0000b273c8b444df094279e70d0ed856ab67616d0000b273e461745c8728c3fdb048422f', 0, 0),
('7wL35TZHU6t9m6KkemYXDN', 'Flatout Ultimate Carnage soundtrack', '', 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebbc7e1f45b012a9ece1873527a', 0, 0),
('7yTtFDjNZCp7XdVmkWjuIl', 'Power up!', '', 'https://mosaic.scdn.co/640/ab67616d0000b27328933b808bfb4cbbd0385400ab67616d0000b27383e260c313dc1ff1f17909cfab67616d0000b27398f415abb90d728279f056acab67616d0000b273bbdafec608fc5329ec2ad831', 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `id` varchar(255) COLLATE utf8_polish_ci NOT NULL COMMENT 'Spotify user ID',
  `username` varchar(30) COLLATE utf8_polish_ci NOT NULL,
  `profile_picture` varchar(255) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_playlists`
--

CREATE TABLE `user_playlists` (
  `user_id` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `playlist_id` varchar(255) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_preferences`
--

CREATE TABLE `user_preferences` (
  `user_id` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `auto_spotify_sync` tinyint(1) NOT NULL,
  `single_command_mode` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `connection`
--
ALTER TABLE `connection`
  ADD PRIMARY KEY (`access_token`),
  ADD KEY `FK_user` (`user_id`);

--
-- Indeksy dla tabeli `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `user_playlists`
--
ALTER TABLE `user_playlists`
  ADD PRIMARY KEY (`playlist_id`,`user_id`) USING BTREE,
  ADD KEY `FK_user_playlists_user` (`user_id`);

--
-- Indeksy dla tabeli `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`user_id`);

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `connection`
--
ALTER TABLE `connection`
  ADD CONSTRAINT `FK_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Ograniczenia dla tabeli `user_playlists`
--
ALTER TABLE `user_playlists`
  ADD CONSTRAINT `FK_user_playlists_playlist` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`),
  ADD CONSTRAINT `FK_user_playlists_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Ograniczenia dla tabeli `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD CONSTRAINT `FK_user_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
