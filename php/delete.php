<?php
// DELETE: exclui um registro pelo ID.
require_once "api.php";
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") falha("Método não permitido.", 405);
$dados = receberDados();
$id = verificarId($dados);
try {
 $consulta = $conexao->prepare("DELETE FROM $tabela WHERE $idColuna = :id");
 $consulta->execute(["id" => $id]);
 echo json_encode(["sucesso" => $consulta->rowCount() > 0]);
} catch (PDOException $erro) { falha("Erro ao excluir registro.", 400); }
