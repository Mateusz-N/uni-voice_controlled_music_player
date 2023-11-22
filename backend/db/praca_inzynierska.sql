-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 22 Lis 2023, 19:19
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
-- Struktura tabeli dla tabeli `album`
--

CREATE TABLE `album` (
  `id` int(11) NOT NULL,
  `playlist_id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_polish_ci NOT NULL,
  `release_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `album_artists`
--

CREATE TABLE `album_artists` (
  `album_id` int(11) NOT NULL,
  `artist_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `artist`
--

CREATE TABLE `artist` (
  `id` int(11) NOT NULL,
  `name` int(11) NOT NULL,
  `description` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `genre`
--

CREATE TABLE `genre` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `oauth_token`
--

CREATE TABLE `oauth_token` (
  `token_id` int(11) NOT NULL,
  `token` text COLLATE utf8_polish_ci NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `playlist`
--

CREATE TABLE `playlist` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_polish_ci NOT NULL,
  `description` text COLLATE utf8_polish_ci NOT NULL,
  `creation_date` date NOT NULL,
  `last_update_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `playlist_tracks`
--

CREATE TABLE `playlist_tracks` (
  `playlist_id` int(11) NOT NULL,
  `track_id` int(11) NOT NULL,
  `position` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `track`
--

CREATE TABLE `track` (
  `id` int(11) NOT NULL,
  `title` varchar(128) COLLATE utf8_polish_ci NOT NULL,
  `artist_id` int(128) NOT NULL,
  `album_id` int(128) NOT NULL,
  `release_year` year(4) NOT NULL,
  `duration_seconds` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `track_genres`
--

CREATE TABLE `track_genres` (
  `track_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(30) COLLATE utf8_polish_ci NOT NULL,
  `email` varchar(319) COLLATE utf8_polish_ci NOT NULL,
  `password` char(60) COLLATE utf8_polish_ci NOT NULL COMMENT 'Hashed password',
  `spotify_account_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `spotify_account_id`) VALUES
(1, 'admin', 'mn25072000@gmail.com', '123', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_playlists`
--

CREATE TABLE `user_playlists` (
  `user_id` int(11) NOT NULL,
  `playlist_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_preferences`
--

CREATE TABLE `user_preferences` (
  `user_id` int(11) NOT NULL,
  `language` int(11) NOT NULL,
  `theme` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_album_playlist` (`playlist_id`);

--
-- Indeksy dla tabeli `album_artists`
--
ALTER TABLE `album_artists`
  ADD PRIMARY KEY (`album_id`,`artist_id`),
  ADD KEY `FK_album_artists_artist` (`artist_id`) USING BTREE;

--
-- Indeksy dla tabeli `artist`
--
ALTER TABLE `artist`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `oauth_token`
--
ALTER TABLE `oauth_token`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `FK_oauth_user` (`user_id`);

--
-- Indeksy dla tabeli `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `playlist_tracks`
--
ALTER TABLE `playlist_tracks`
  ADD PRIMARY KEY (`playlist_id`,`track_id`),
  ADD KEY `FK_playlist_tracks_track` (`track_id`);

--
-- Indeksy dla tabeli `track`
--
ALTER TABLE `track`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_track_artist` (`artist_id`),
  ADD KEY `FK_track_album` (`album_id`);

--
-- Indeksy dla tabeli `track_genres`
--
ALTER TABLE `track_genres`
  ADD PRIMARY KEY (`track_id`,`genre_id`),
  ADD KEY `FK_track_genres_genre` (`genre_id`);

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `user_playlists`
--
ALTER TABLE `user_playlists`
  ADD PRIMARY KEY (`user_id`,`playlist_id`),
  ADD KEY `FK_user_playlists_playlist` (`playlist_id`);

--
-- Indeksy dla tabeli `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD KEY `FK_user_preferences_user` (`user_id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `album`
--
ALTER TABLE `album`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `artist`
--
ALTER TABLE `artist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `genre`
--
ALTER TABLE `genre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `oauth_token`
--
ALTER TABLE `oauth_token`
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `track`
--
ALTER TABLE `track`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `FK_album_playlist` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`);

--
-- Ograniczenia dla tabeli `oauth_token`
--
ALTER TABLE `oauth_token`
  ADD CONSTRAINT `FK_oauth_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Ograniczenia dla tabeli `playlist_tracks`
--
ALTER TABLE `playlist_tracks`
  ADD CONSTRAINT `FK_playlist_tracks_playlist` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`),
  ADD CONSTRAINT `FK_playlist_tracks_track` FOREIGN KEY (`track_id`) REFERENCES `track` (`id`);

--
-- Ograniczenia dla tabeli `track`
--
ALTER TABLE `track`
  ADD CONSTRAINT `FK_track_album` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`),
  ADD CONSTRAINT `FK_track_artist` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

--
-- Ograniczenia dla tabeli `track_genres`
--
ALTER TABLE `track_genres`
  ADD CONSTRAINT `FK_track_genres_genre` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`),
  ADD CONSTRAINT `FK_track_genres_track` FOREIGN KEY (`track_id`) REFERENCES `track` (`id`);

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
