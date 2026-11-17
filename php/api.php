<?php
// Funções compartilhadas pelo CRUD: cada operação fica em seu arquivo.
header("Content-Type: application/json; charset=utf-8");
require_once "conexao.php";
$entidade = $_GET["entidade"] ?? "";
$tabelas = [
 "tutores" => ["tabela" => "Tutor", "id" => "ID_Tutor", "campos" => ["Nome", "Telefone", "Email"], "obrigatorios" => ["Nome"]],
 "pets" => ["tabela" => "Pet", "id" => "ID_Pet", "campos" => ["Nome", "Especie", "Raca", "Data_nascimento", "ID_Tutor"], "obrigatorios" => ["Nome", "Especie", "ID_Tutor"]],
 "atendimentos" => ["tabela" => "Atendimento", "id" => "ID_Atendimento", "campos" => ["Servico", "Data_hora", "Valor", "ID_Pet"], "obrigatorios" => ["Servico", "Data_hora", "Valor", "ID_Pet"]]
];
function falha($mensagem, $codigo = 400) {
 http_response_code($codigo);
 echo json_encode(["erro" => $mensagem]);
 exit;
}
if (!isset($tabelas[$entidade])) falha("Entidade inválida.");
$config = $tabelas[$entidade];
$tabela = $config["tabela"];
$idColuna = $config["id"];
$campos = $config["campos"];
function receberDados() {
 $dados = json_decode(file_get_contents("php://input"), true);
 if (!is_array($dados)) falha("Envie um JSON válido.");
 return $dados;
}
function verificarCampos($dados, $config) {
 foreach ($config["obrigatorios"] as $campo) {
  if (!isset($dados[$campo]) || trim((string)$dados[$campo]) === "") falha("Campo obrigatório: " . $campo);
 }
 $valores = [];
 foreach ($config["campos"] as $campo) {
  $valor = $dados[$campo] ?? null;
  $valores[$campo] = ($valor === "") ? null : $valor;
 }
 return $valores;
}
function verificarId($dados) {
 $id = filter_var($dados["id"] ?? null, FILTER_VALIDATE_INT);
 if (!$id || $id < 1) falha("ID inválido.");
 return $id;
}
