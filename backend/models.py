# models.py — Classes que representam os dados do sistema

class Tutor:
    def __init__(self, nome, telefone=None, email=None, id_tutor=None):
        # id_tutor começa como None porque quem gera o número é o banco
        self.id_tutor = id_tutor
        self.nome = nome
        self.telefone = telefone
        self.email = email

    def to_dict(self):
        """Transforma o objeto em dicionário, para o Flask enviar como JSON."""
        return {
            "id_tutor": self.id_tutor,
            "nome": self.nome,
            "telefone": self.telefone,
            "email": self.email
        }


class Pet:
    def __init__(self, nome, especie, id_tutor, raca=None, data_nascimento=None, id_pet=None):
        self.id_pet = id_pet
        self.nome = nome
        self.especie = especie
        self.raca = raca
        self.data_nascimento = data_nascimento
        self.id_tutor = id_tutor   # a FK: de qual tutor é este pet

    def to_dict(self):
        return {
            "id_pet": self.id_pet,
            "nome": self.nome,
            "especie": self.especie,
            "raca": self.raca,
            # datas viram texto, porque JSON não entende o tipo date do Python
            "data_nascimento": str(self.data_nascimento) if self.data_nascimento else None,
            "id_tutor": self.id_tutor
        }


class Atendimento:
    def __init__(self, servico, data_hora, valor, id_pet, id_atendimento=None):
        self.id_atendimento = id_atendimento
        self.servico = servico
        self.data_hora = data_hora
        self.valor = valor
        self.id_pet = id_pet       # a FK: em qual pet foi feito

    def to_dict(self):
        return {
            "id_atendimento": self.id_atendimento,
            "servico": self.servico,
            "data_hora": str(self.data_hora),
            "valor": float(self.valor),   # DECIMAL vira número normal
            "id_pet": self.id_pet
        }