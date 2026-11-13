# dao.py — Classes que conversam com o banco de dados

from conexao import conectar
from models import Tutor, Pet, Atendimento


class TutorDAO:
    def inserir(self, tutor):
        con = conectar()
        cursor = con.cursor()
        # %s são "espaços reservados": o conector preenche com segurança
        sql = "INSERT INTO Tutor (Nome, Telefone, Email) VALUES (%s, %s, %s)"
        cursor.execute(sql, (tutor.nome, tutor.telefone, tutor.email))
        con.commit()                        # confirma a gravação no banco
        tutor.id_tutor = cursor.lastrowid   # pega o id que o banco gerou
        cursor.close()
        con.close()
        return tutor

    def listar(self):
        con = conectar()
        cursor = con.cursor()
        cursor.execute("SELECT ID_Tutor, Nome, Telefone, Email FROM Tutor")
        tutores = []
        for linha in cursor.fetchall():
            # linha = (id, nome, telefone, email)
            tutores.append(Tutor(linha[1], linha[2], linha[3], linha[0]))
        cursor.close()
        con.close()
        return tutores

    def buscar_por_id(self, id_tutor):
        con = conectar()
        cursor = con.cursor()
        cursor.execute("SELECT ID_Tutor, Nome, Telefone, Email FROM Tutor WHERE ID_Tutor = %s", (id_tutor,))
        linha = cursor.fetchone()   # fetchone = pega só um resultado
        cursor.close()
        con.close()
        if linha is None:
            return None
        return Tutor(linha[1], linha[2], linha[3], linha[0])


class PetDAO:
    def inserir(self, pet):
        con = conectar()
        cursor = con.cursor()
        sql = """INSERT INTO Pet (Nome, Especie, Raca, Data_nascimento, ID_Tutor)
                 VALUES (%s, %s, %s, %s, %s)"""
        cursor.execute(sql, (pet.nome, pet.especie, pet.raca, pet.data_nascimento, pet.id_tutor))
        con.commit()
        pet.id_pet = cursor.lastrowid
        cursor.close()
        con.close()
        return pet

    def listar(self):
        con = conectar()
        cursor = con.cursor()
        cursor.execute("SELECT ID_Pet, Nome, Especie, Raca, Data_nascimento, ID_Tutor FROM Pet")
        pets = []
        for linha in cursor.fetchall():
            # Pet(nome, especie, id_tutor, raca, data_nascimento, id_pet)
            pets.append(Pet(linha[1], linha[2], linha[5], linha[3], linha[4], linha[0]))
        cursor.close()
        con.close()
        return pets


class AtendimentoDAO:
    def inserir(self, atendimento):
        con = conectar()
        cursor = con.cursor()
        sql = """INSERT INTO Atendimento (Servico, Data_hora, Valor, ID_Pet)
                 VALUES (%s, %s, %s, %s)"""
        cursor.execute(sql, (atendimento.servico, atendimento.data_hora,
                             atendimento.valor, atendimento.id_pet))
        con.commit()
        atendimento.id_atendimento = cursor.lastrowid
        cursor.close()
        con.close()
        return atendimento

    def listar(self):
        con = conectar()
        cursor = con.cursor()
        cursor.execute("SELECT ID_Atendimento, Servico, Data_hora, Valor, ID_Pet FROM Atendimento")
        atendimentos = []
        for linha in cursor.fetchall():
            # Atendimento(servico, data_hora, valor, id_pet, id_atendimento)
            atendimentos.append(Atendimento(linha[1], linha[2], linha[3], linha[4], linha[0]))
        cursor.close()
        con.close()
        return atendimentos