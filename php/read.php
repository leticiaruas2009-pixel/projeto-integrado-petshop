<?php
// READ: consulta os registros cadastrados.
require_once "api.php";
if ($_SERVER["REQUEST_METHOD"] !== "GET") falha("Método não permitido.", 405);
try {
 $consulta = $conexao->query("SELECT * FROM $tabela ORDER BY $idColuna DESC");
 echo json_encode($consulta->fetchAll());
} catch (PDOException $erro) { falha("Erro ao consultar registros.", 500); }
