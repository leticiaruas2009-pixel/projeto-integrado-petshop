<?php
// Ajuste os dados de conexão conforme o MySQL do seu computador.
$host = "localhost";
$banco = "petshop";
$usuario = "root";
$senha = "";

try {
    $conexao = new PDO("mysql:host=$host;dbname=$banco;charset=utf8mb4", $usuario, $senha);
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexao->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $erro) {
    http_response_code(500);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(["erro" => "Não foi possível conectar ao banco de dados."]);
    exit;
}
