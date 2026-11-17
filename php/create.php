<?php
// CREATE: recebe os dados e cadastra um registro.
require_once "api.php";
if ($_SERVER["REQUEST_METHOD"] !== "POST") falha("Método não permitido.", 405);
$dados = receberDados();
$valores = verificarCampos($dados, $config);
$colunas = implode(", ", $campos);
$marcadores = ":" . implode(", :", $campos);
try {
 $consulta = $conexao->prepare("INSERT INTO $tabela ($colunas) VALUES ($marcadores)");
 $consulta->execute($valores);
 http_response_code(201);
 echo json_encode(["sucesso" => true, "id" => (int)$conexao->lastInsertId()]);
} catch (PDOException $erro) { falha("Erro ao cadastrar. Verifique os dados e os vínculos.", 400); }
