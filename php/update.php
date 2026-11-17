<?php
// UPDATE: atualiza o registro selecionado.
require_once "api.php";
if ($_SERVER["REQUEST_METHOD"] !== "PUT") falha("Método não permitido.", 405);
$dados = receberDados();
$id = verificarId($dados);
$valores = verificarCampos($dados, $config);
$partes = [];
foreach ($campos as $campo) $partes[] = "$campo = :$campo";
$sql = "UPDATE $tabela SET " . implode(", ", $partes) . " WHERE $idColuna = :id";
$valores["id"] = $id;
try {
 $consulta = $conexao->prepare($sql);
 $consulta->execute($valores);
 echo json_encode(["sucesso" => true]);
} catch (PDOException $erro) { falha("Erro ao atualizar. Verifique os dados e os vínculos.", 400); }
