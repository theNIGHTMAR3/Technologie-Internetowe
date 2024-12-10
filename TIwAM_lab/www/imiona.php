<?php
// najprostszy webservice zwracający tablicę rekordów z imionami
// nagłówki informujące o zwracanej treści w formacie JSON i dla CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// połączenie z bazą danych
$db = new PDO('sqlite:imiona.db');

// odczytanie parametru filter z metody GET (z URL)
$filter = $_GET['filter'] ?? '';
if (!empty($filter)) {
    // użycie funkcji z przedrostkiem mb_ poprawnie obsługuje wielobajtowe znaki diakrytyczne
    // zamiana na kapitaliki rozwiązuje problem znaków diakrytycznych na początku filtru
    $filter = strip_tags($filter);
    $filter = mb_substr($filter, 0, 13);
    $filter = mb_strtoupper($filter, 'utf-8');
}

// pobranie danych z bazy
$sql = "SELECT imie, plec, pozycja, liczba
        FROM imiona
        WHERE imie LIKE :wzor";
$res = $db->prepare($sql);
$res->bindValue(':wzor', "$filter%");
$res->execute();

// wynik jako tablica asocjacyjna (nazwane indeksy)
$arr = $res->fetchAll(PDO::FETCH_ASSOC);

// wyprowadzenie wyników w formacie JSON
$json = json_encode($arr);
print($json);
