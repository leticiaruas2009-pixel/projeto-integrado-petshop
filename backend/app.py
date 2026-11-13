# app.py — Rotas da API (o "garçom" do sistema)

from flask import Flask, jsonify, request
import mysql.connector
from models import Tutor, Pet, Atendimento
from dao import TutorDAO, PetDAO, AtendimentoDAO

app = Flask(__name__)

tutor_dao = TutorDAO()
pet_dao = PetDAO()
atendimento_dao = AtendimentoDAO()


# ---------- TUTORES ----------

@app.route("/tutores", methods=["GET"])
def listar_tutores():
    tutores = tutor_dao.listar()
    return jsonify([t.to_dict() for t in tutores])

@app.route("/tutores/<int:id_tutor>", methods=["GET"])
def buscar_tutor(id_tutor):
    tutor = tutor_dao.buscar_por_id(id_tutor)
    if tutor is None:
        return jsonify({"erro": "Tutor não encontrado"}), 404
    return jsonify(tutor.to_dict())

@app.route("/tutores", methods=["POST"])
def cadastrar_tutor():
    dados = request.get_json()   # lê o JSON enviado
    if not dados or not dados.get("nome"):
        return jsonify({"erro": "O campo nome é obrigatório"}), 400
    tutor = Tutor(dados["nome"], dados.get("telefone"), dados.get("email"))
    tutor_dao.inserir(tutor)
    return jsonify(tutor.to_dict()), 201   # 201 = criado com sucesso


# ---------- PETS ----------

@app.route("/pets", methods=["GET"])
def listar_pets():
    return jsonify([p.to_dict() for p in pet_dao.listar()])

@app.route("/pets", methods=["POST"])
def cadastrar_pet():
    dados = request.get_json()
    if not dados or not dados.get("nome") or not dados.get("especie") or not dados.get("id_tutor"):
        return jsonify({"erro": "Campos obrigatórios: nome, especie, id_tutor"}), 400
    pet = Pet(dados["nome"], dados["especie"], dados["id_tutor"],
              dados.get("raca"), dados.get("data_nascimento"))
    try:
        pet_dao.inserir(pet)
    except mysql.connector.Error:
        # acontece, por exemplo, se o id_tutor não existir (erro da FK)
        return jsonify({"erro": "Não foi possível cadastrar. Verifique o id_tutor."}), 400
    return jsonify(pet.to_dict()), 201


# ---------- ATENDIMENTOS ----------

@app.route("/atendimentos", methods=["GET"])
def listar_atendimentos():
    return jsonify([a.to_dict() for a in atendimento_dao.listar()])

@app.route("/atendimentos", methods=["POST"])
def cadastrar_atendimento():
    dados = request.get_json()
    obrigatorios = ["servico", "data_hora", "valor", "id_pet"]
    if not dados or any(not dados.get(c) for c in obrigatorios):
        return jsonify({"erro": "Campos obrigatórios: servico, data_hora, valor, id_pet"}), 400
    atendimento = Atendimento(dados["servico"], dados["data_hora"], dados["valor"], dados["id_pet"])
    try:
        atendimento_dao.inserir(atendimento)
    except mysql.connector.Error:
        return jsonify({"erro": "Não foi possível cadastrar. Verifique o id_pet."}), 400
    return jsonify(atendimento.to_dict()), 201


if __name__ == "__main__":
    app.run(debug=True)   # debug=True reinicia sozinho quando você salva